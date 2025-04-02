:::tip
动态增加Quartz定时任务，通过自定义注解来实现具体的定时任务方法调用。
:::
**相关依赖如下**

```xml
<!-- 用来动态创建 Quartz 定时任务 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-quartz</artifactId>
</dependency>
```

# 1. 注解及相关实体类

## 1. TaskDesc注解

> 用于描述定时任务的方法名和描述信息, 方便

```java
import java.lang.annotation.*;

/**
 * @author eleven
 * @date 2025/2/25 9:45
 * @apiNote
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface TaskDesc {
    String methodName();

    String desc();
}
```

## 2. 任务实体类

```java 
@Data
@TableName("sys_task_config")
@ApiModel(value="定时任务配置")
public class TaskConfig extends BaseEntity {

    @ApiModelProperty("定时任务表达式")
    private String cron;

    @ApiModelProperty("执行类的全限定名")
    private String execClass;

    @ApiModelProperty("方法名")
    private String execMethod;

    @ApiModelProperty("是否运行")
    private Boolean startFlag;

    @ApiModelProperty("任务名称")
    private String cronName;

    public String getExecMethod() {
        return StrUtil.isNotBlank(execMethod) ? execMethod.replace("()", "").trim() : execMethod;
    }

    public String getExecClass() {
        return StrUtil.isNotBlank(execClass) ? execClass.trim(): execClass;
    }

    public String getCron() {
        return StrUtil.isNotBlank(cron) ? cron.trim() : cron;
    }
} 
```

## 3. 可选任务配置 vo

> 用于前端展示，前端配置定时任务的时候只能从 @TaskDesc 注解中获取到的方法名中选择。
> 也是为了限制前端用户乱填方法名，避免定时任务执行失败

```java 
@Data
public class TaskDescVo {

    private Integer index;

    private String beanName;

    private String className;

    private String methodName;

    private String desc;
} 
```

## 4. 任务执行记录

```java
@Data
@TableName("credit_task_run_log")
@ApiModel("定时任务日志")
public class TaskRunLog extends BaseEntity<TaskRunLog> {

    @NotBlank(message = "任务id不能为空")
    private String taskId;
     
    @ApiModelProperty("任务开始时间")
    private LocalDateTime runTime;
     
    @ApiModelProperty("任务完成时间")
    private LocalDateTime completedTime;
     
    @ApiModelProperty("任务间隔时间")
    private Long intervalSeconds;
     
    @ApiModelProperty("任务运行状态")
    private Boolean runFlag;
     
    @ApiModelProperty("任务运行消息")
    private String message;

    public LocalDateTime getRunTime() {
        return getTime(runTime);
    }

    public LocalDateTime getCompletedTime() {
        return getTime(completedTime);
    }

    public LocalDateTime getTime(LocalDateTime time) {
        return Optional.ofNullable(time).orElse(LocalDateTime.now());
    }

    public Long getIntervalSeconds() {
        return Math.abs(Duration.between(getRunTime(), getCompletedTime()).getSeconds());
    }
}
```
## 5. CronDto
> 前端传入选择的执行时间，通过CronUtil生成cron表达式
```java
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author eleven
 * @date 2023/12/6 8:19
 * @apiNote
 */
@Data
public class CronDto {
    /**
     * 选择的小时
     */
    @NotNull(message = "执行小时参数不允许为空")
    private List<String> chooseHours;

    /**
     * 选择的天数
     */
    private List<String> chooseDays;

    /**
     * 选择周几执行
     */
    private List<String> chooseDayOfWeeks;
}
```

# 2. 定时任务配置
## 1. PostRunner
> 用于在项目启动的时候，从数据库中获取到所有的定时任务配置，然后根据配

```java
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import net.lesscoding.task.domain.TaskConfig;
import net.lesscoding.task.service.TaskConfigService;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.List;

/**
 * @author eleven
 * @date 2024/11/11 15:01
 * @apiNote
 */
@Component
@Slf4j
public class PostRunner {
    @Autowired
    private TaskConfigService taskConfigService;

    @Autowired
    private SchedulerFactoryBean schedulerFactoryBean;
    @Autowired
    private Gson gson;

    @PostConstruct
    public void run() throws Exception {
        List<TaskConfig> planTaskList = taskConfigService.selectAll();
        log.info("==============定时任务配置中心日志开始====================");
        log.info("计划任务列表:{}", gson.toJson(planTaskList));
        log.info("==============定时任务配置中心日志结束====================");
        Scheduler scheduler = schedulerFactoryBean.getScheduler();
        if (CollUtil.isNotEmpty(planTaskList)) {
            for (TaskConfig planTask : planTaskList) {
                JobDetail jobDetail = JobBuilder.newJob(RunnerJob.class)
                        .withIdentity(planTask.getId(), StrUtil.format("{}#{}", planTask.getExecClass(), planTask.getExecMethod()))
                        .build();
                Trigger trigger = TriggerBuilder.newTrigger()
                        .withIdentity(planTask.getId(), StrUtil.format("{}#{}", planTask.getExecClass(), planTask.getExecMethod()))
                        .startNow()
                        .withSchedule(CronScheduleBuilder.cronSchedule(planTask.getCron()))
                        .build();
                scheduler.scheduleJob(jobDetail, trigger);
                scheduler.start();
            }
        }
    }
}
```
## 2. Job类
> 具体 `Quartz` 任务执行的 `Job`, `Quartz` 最终会调用 `RunnerJob` 的 `execute` 方法来执行定时任务

```java
import net.lesscoding.task.service.TaskConfigService;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.JobKey;
import org.quartz.impl.triggers.CronTriggerImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * @author eleven
 * @date 2024/11/11 14:22
 * @apiNote
 */
@Slf4j
@Component
public class RunnerJob implements Job {
    @Autowired
    private TaskConfigService taskConfigService;
    @Override
    public void execute(JobExecutionContext jobExecutionContext) {
        JobDetail jobDetail = jobExecutionContext.getJobDetail();
        JobKey key = jobDetail.getKey();
        String planId = key.getName();
        log.info("{} trigger {}", planId, ((CronTriggerImpl) jobExecutionContext.getTrigger()).getCronExpression());
        log.info("{} jobKey {} time {}", planId, key, LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        log.info("定时任务开始执行");
        try {
            taskConfigService.runPlan(jobDetail);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
```
## 3. 定时任务控制器
> 用于前端展示定时任务配置，以及新增、修改、删除定时任务配置
```java
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import net.lesscoding.task.core.annotations.Log;
import net.lesscoding.task.core.common.AjaxResult;
import net.lesscoding.task.core.enums.BusinessType;
import net.lesscoding.task.domain.CronDto;
import net.lesscoding.task.domain.TaskConfig;
import net.lesscoding.task.service.TaskConfigService;
import net.lesscoding.task.utils.ResultUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * @author eleven
 * @date 2024/11/11 15:56
 * @apiNote
 */

@Api(tags = "定时任务配置")
@RestController
@RequestMapping("/task/config")
public class TaskConfigController {

    @Autowired
    private TaskConfigService taskConfigService;

    @ApiOperation("查询配置列表")
    @PostMapping("/page")
    public AjaxResult page(@RequestBody TaskConfig taskConfig) {
        Page<TaskConfig> list = taskConfigService.getConfigList(taskConfig);
        return ResultUtil.success(list);
    }

    @ApiOperation("编辑配置")
    @PostMapping("/edit")
    @Log(title = "编辑定时任务配置", businessType = BusinessType.UPDATE)
    public AjaxResult edit(@RequestBody TaskConfig taskConfig) throws SchedulerException {
        return ResultUtil.toAjax(taskConfigService.editTaskConfig(taskConfig));
    }

    @PostMapping("/getCron")
    @ApiOperation("获取表达式")
    public AjaxResult getCron(@Valid @RequestBody CronDto dto) {
        return ResultUtil.success(taskConfigService.getCron(dto));
    }

    @ApiOperation("删除配置")
    @DeleteMapping("/del/{id}")
    @Log(title = "删除定时任务配置", businessType = BusinessType.DELETE)
    public AjaxResult del(@PathVariable String id) throws SchedulerException {
        return ResultUtil.toAjax(taskConfigService.delTaskConfig(id));
    }

    @ApiOperation("获取所有任务列表")
    @GetMapping("/taskList")
    public AjaxResult taskList() {
        return ResultUtil.success(taskConfigService.getAllTaskDescList());
    }
}
```
## 4. ServiceImpl实现类
> 用于实现定时任务的具体逻辑，包括获取所有任务列表、获取表达式、编辑配置、删除配置、获取配置列表、运行计划等方法

```java
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.plugins.pagination.PageDTO;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import net.lesscoding.task.core.annotations.TaskDesc;
import net.lesscoding.task.core.common.GlobalException;
import net.lesscoding.task.dao.TaskConfigMapper;
import net.lesscoding.task.dao.TaskRunLogMapper;
import net.lesscoding.task.domain.CronDto;
import net.lesscoding.task.domain.TaskConfig;
import net.lesscoding.task.domain.TaskRunLog;
import net.lesscoding.task.model.vo.TaskDescVo;
import net.lesscoding.task.runner.RunnerJob;
import net.lesscoding.task.service.TaskConfigService;
import net.lesscoding.task.utils.CronUtil;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.stereotype.Service;

import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author eleven
 * @date 2024/11/11 14:21
 * @apiNote
 */
@Service
@Slf4j
public class TaskConfigServiceImpl extends ServiceImpl<TaskConfigMapper, TaskConfig> implements TaskConfigService {

    @Autowired
    private TaskConfigMapper configMapper;
    @Autowired
    private TaskRunLogMapper runLogMapper;
    @Autowired
    private ConfigurableListableBeanFactory beanFactory;
    @Autowired
    private SchedulerFactoryBean schedulerFactoryBean;
    @Autowired
    private ApplicationContext applicationContext;

    @Override
    public List<TaskConfig> selectAll() {
        return configMapper.selectList(new QueryWrapper<>());
    }
    
    /**
     * 具体执行任务的方法
     * @param jobDetail Quartz的JobDetail对象，包含任务的详细信息
     * @return
     */
    @Override
    @Async
    public void runPlan(JobDetail jobDetail) {
        JobKey key = jobDetail.getKey();
        String taskId = key.getName();
        TaskRunLog runLog = new TaskRunLog();
        runLog.setId(IdUtil.simpleUUID());
        runLog.setTaskId(taskId);
        runLog.setRunTime(LocalDateTime.now());
        TaskConfig taskConfig = configMapper.selectById(taskId);
        if (taskConfig == null || !taskConfig.getStartFlag()) {
            String logStr = StrUtil.format("任务ID {} 不存在或配置为关闭 {}", taskId, taskConfig);
            log.info(logStr);
            runLog.setRunFlag(false);
            runLog.setCompletedTime(LocalDateTime.now());
            runLog.setMessage(logStr);
            runLogMapper.insert(runLog);
            return;
        }

        String className = taskConfig.getExecClass();
        String methodName = taskConfig.getExecMethod();
        try {
            // 这里可以直接通过 applicationContext 获取到类的实例
            // Object bean = applicationContext.getBean(className);
            // 加载类并获取实例
            Class<?> execClass = getClass().getClassLoader().loadClass(className);
            // 从Spring容器中获取实例
            Object bean = beanFactory.getBean(execClass);
            // 获取方法
            Method execMethod = execClass.getDeclaredMethod(methodName);
            // 执行方法
            Object invoke = execMethod.invoke(bean);
            runLog.setRunFlag(true);
            runLog.setMessage(String.valueOf(invoke));
        } catch (Exception e) {
            runLog.setRunFlag(false);
            runLog.setMessage(e.getCause().getMessage());
            log.error("执行任务失败", e);
        }
        runLog.setCompletedTime(LocalDateTime.now());
        runLogMapper.insert(runLog);
    }

    @Override
    public Page<TaskConfig> getConfigList(TaskConfig taskConfig) {
        PageDTO page = taskConfig.getPage();
        List<TaskConfig> list = configMapper.getPageByLike(page, taskConfig);
        page.setRecords(list);
        return page;
    }

    @Override
    public int editTaskConfig(TaskConfig taskConfig) throws SchedulerException {
        checkEditTaskConfig(taskConfig);
        if (StrUtil.isBlank(taskConfig.getId())) {
            return saveTaskConfig(taskConfig);
        }
        return updateTaskConfig(taskConfig);
    }

    @Override
    public int delTaskConfig(String id) throws SchedulerException {
        TaskConfig taskConfig = configMapper.selectById(id);
        deleteJob(taskConfig);
        return configMapper.deleteById(id);
    }

    private void checkEditTaskConfig(TaskConfig taskConfig) {
        boolean valid = CronUtil.isValid(taskConfig.getCron());
        if (!valid) {
            throw new GlobalException("cron表达式不合法");
        }
        try {
            Class<?> execClass = getClass().getClassLoader().loadClass(taskConfig.getExecClass());
            Object bean = beanFactory.getBean(execClass);
            if (bean == null) {
                throw new GlobalException("请检查当前类名是否存在");
            }
            Method declaredMethod = execClass.getDeclaredMethod(taskConfig.getExecMethod());
            if (declaredMethod == null) {
                throw new GlobalException(StrUtil.format("请检查当前方法{}#{}()是否存在", taskConfig.getExecClass(), taskConfig.getExecMethod()));
            }
        } catch (ClassNotFoundException e) {
            throw new GlobalException("请检查当前类名是否存在");
        } catch (NoSuchMethodException e) {
            throw new GlobalException(StrUtil.format("请检查当前方法{}#{}()是否存在", taskConfig.getExecClass(), taskConfig.getExecMethod()));
        }
        List<TaskConfig> allTasks = selectAll();
        List<TaskConfig> sameTaskList = allTasks.stream()
                .filter(item -> StrUtil.equals(item.getExecClass(), taskConfig.getExecClass())
                        && StrUtil.equals(item.getExecMethod(), taskConfig.getExecMethod()))
                .collect(Collectors.toList());
        if (CollUtil.isNotEmpty(sameTaskList)) {
            // 新增任务的时候存在相同的类名和方法名
            if (StrUtil.isBlank(taskConfig.getId())) {
                throw new GlobalException(StrUtil.format("任务{}.{}()已存在", taskConfig.getExecClass(), taskConfig.getExecMethod()));
            }
            // 修改任务的时候存在相同的类名和方法名
            if (sameTaskList.size() == 1 && !StrUtil.equals(sameTaskList.get(0).getId(), taskConfig.getId())) {
                throw new GlobalException(StrUtil.format("任务{}.{}()已存在", taskConfig.getExecClass(), taskConfig.getExecMethod()));
            }
        }
    }

    public int saveTaskConfig(TaskConfig taskConfig) throws SchedulerException {
        taskConfig.setId(IdUtil.simpleUUID());
        int effect = configMapper.insert(taskConfig);
        createNewScheduler(taskConfig);
        return effect;
    }

    public int updateTaskConfig(TaskConfig taskConfig) throws SchedulerException {
        deleteJob(configMapper.selectById(taskConfig.getId()));
        int effect = configMapper.updateById(taskConfig);
        createNewScheduler(taskConfig);
        return effect;
    }

    private void createNewScheduler(TaskConfig task) throws SchedulerException {
        log.info("开始执行创建新任务");
        Scheduler scheduler = schedulerFactoryBean.getScheduler();
        JobKey jobKey = jobKey(task);
        JobDetail jobDetail = JobBuilder.newJob(RunnerJob.class)
                .withIdentity(jobKey)
                .build();

        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity(task.getId(), StrUtil.format("{}#{}", task.getExecClass(), task.getExecMethod()))
                .startNow()
                .withSchedule(CronScheduleBuilder.cronSchedule(task.getCron()))
                .build();
        scheduler.scheduleJob(jobDetail, trigger);
        scheduler.start();
        log.info("任务创建完成");
    }

    /**
     * 阐述job
     *
     * @param task
     * @throws SchedulerException
     */
    public boolean deleteJob(TaskConfig task) throws SchedulerException {
        Scheduler scheduler = schedulerFactoryBean.getScheduler();
        JobKey jobKey = jobKey(task);
        boolean deleteJob = scheduler.deleteJob(jobKey);
        log.info("当前 jobKey {} 删除结果{}", jobKey, deleteJob);
        return deleteJob;
    }

    private JobKey jobKey(TaskConfig task) {
        JobKey jobKey = new JobKey(task.getId(), StrUtil.format("{}#{}", task.getExecClass(), task.getExecMethod()));
        log.info("当前任务 {}， jobKey{}", task, jobKey);
        return jobKey;
    }

    @Override
    public String getCron(CronDto dto) {
        boolean daysEmptyFlag = CollUtil.isEmpty(dto.getChooseDays());
        boolean dayOfWeeksEmptyFlag = CollUtil.isEmpty(dto.getChooseDayOfWeeks());
        if (daysEmptyFlag && dayOfWeeksEmptyFlag) {
            throw new RuntimeException("执行天数和星期必须选择一个");
        }
        if (!daysEmptyFlag && !dayOfWeeksEmptyFlag) {
            throw new RuntimeException("执行天数和星期只能选择一个");
        }

        String hours = String.join(",", dto.getChooseHours());
        String days = CollUtil.isEmpty(dto.getChooseDays()) ? "?" : String.join(",", dto.getChooseDays());
        String dayOfWeek = CollUtil.isEmpty(dto.getChooseDayOfWeeks()) ? "?" : String.join(",", dto.getChooseDayOfWeeks());
        String cronStr = String.format("0 0 %s %s * %s", hours, days, dayOfWeek);
        if (!CronUtil.isValid(cronStr)) {
            throw new RuntimeException("定时任务表达式不合法");
        }
        log.info("当前任务表达式 {}", cronStr);
        return cronStr;
    }

    @Override
    public List<TaskDescVo> getAllTaskDescList() {
        List<TaskDescVo> result = new ArrayList<>();
        List<String> beanNames = new ArrayList<>(Arrays.asList(applicationContext.getBeanDefinitionNames()));
        beanNames.sort(String::compareTo);
        TaskDescVo vo = null;
        for (String beanName : beanNames) {
            Object bean = applicationContext.getBean(beanName);
            Class<?> beanClass = bean.getClass();
            if (beanClass.isAnnotationPresent(TaskDesc.class)) {
                TaskDesc annotation = beanClass.getAnnotation(TaskDesc.class);
                vo = new TaskDescVo();
                vo.setMethodName(annotation.methodName());
                vo.setDesc(annotation.desc());
                vo.setBeanName(beanName);
                vo.setClassName(beanClass.getName());
                vo.setIndex(beanNames.indexOf(beanName));
                result.add(vo);
            }
        }
        return result;
    }

    private CronDto parseCron(String cron) {
        String[] split = cron.split(" ");
        // 计算几个小时
        String cronHours = split[2];
        // 计算几天
        String cronDays = split[3];
        // 计算的周期
        String cronDayOfWeeks = split[5];
        CronDto cronDto = new CronDto();
        cronDto.setChooseHours(Arrays.asList(cronHours.split(",")));
        cronDto.setChooseDays(Arrays.asList(cronDays.split(",")));
        cronDto.setChooseDayOfWeeks(Arrays.asList(cronDayOfWeeks.split(",")));
        return cronDto;
    }
}
```
## 5. CronUtil
```java
import org.quartz.CronExpression;

import java.text.ParseException;
import java.util.Date;

/**
 * cron表达式工具类
 *
 * @author ruoyi
 */
public class CronUtil {
    /**
     * 返回一个布尔值代表一个给定的Cron表达式的有效性
     *
     * @param cronExpression Cron表达式
     * @return boolean 表达式是否有效
     */
    public static boolean isValid(String cronExpression) {
        return CronExpression.isValidExpression(cronExpression);
    }

    public static void main(String[] args) {
        System.out.println(isValid("0/1 * * * * ?"));
    }

    /**
     * 返回一个字符串值,表示该消息无效Cron表达式给出有效性
     *
     * @param cronExpression Cron表达式
     * @return String 无效时返回表达式错误描述,如果有效返回null
     */
    public static String getInvalidMessage(String cronExpression) {
        try {
            new CronExpression(cronExpression);
            return null;
        } catch (ParseException pe) {
            return pe.getMessage();
        }
    }

    /**
     * 返回下一个执行时间根据给定的Cron表达式
     *
     * @param cronExpression Cron表达式
     * @return Date 下次Cron表达式执行时间
     */
    public static Date getNextExecution(String cronExpression) {
        try {
            CronExpression cron = new CronExpression(cronExpression);
            return cron.getNextValidTimeAfter(new Date(System.currentTimeMillis()));
        } catch (ParseException e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }
}
```
## 6. @TaskDesc注解使用
> 被`@TaskDesc`注解的类需要使用`@Component`注解标注，被SpringBoot容器管理到定时任务才能正常执行

```java
import net.lesscoding.task.core.annotations.TaskDesc;
import net.lesscoding.task.dao.EvaluateDsCustomerMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.jexl3.JexlEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author eleven
 * @date 2025/3/12 15:11
 * @apiNote 客户评分计数器
 */
@Component
@Slf4j
@TaskDesc(methodName = "scoreCounter", desc = "客户评分计数器")
public class CustomerScoreCounter extends AbstractScoreCounter {

    @Autowired
    private EvaluateDsCustomerMapper dsCustomerMapper;
    @Autowired
    private JexlEngine jexlEngine;
    
    // 定时任务实际执行的方法
    @Override
    public void scoreCounter() {
        calcScoreAndSave(2, null, "customer_id",dsCustomerMapper.selectList(null));
    }
}
```
