---
title: Spring注释配置
summary: 本文记录了常见的Spring注释配置，例如基本配置，事务配置等。
tags:
  - spring
toc: true
date: 2021-10-12T14:14:00+08:00
slug: spring
---
### Spring注释配置
Spring配置可以使用注释及xml两种方式。本文记录了探索使用spring注释配置的备忘。

#### @RequestBody
用于[@RequestMapping](#requestmapping)方法的参数中，仅能有一个，会尝试将post的json解析到实体类中
```java
@RequestBody ETag eTag
```

#### @RequestMapping
用于[@Controller](#controller)下，
```java
@RequestMapping("/appointments") 
@RequestMapping(value="/{day}", method = RequestMethod.GET)
@RequestMapping("/spring-web/{symbolicName:[a-z-]+}-{version:\d\.\d\.\d}.{extension:\.[a-z]}") 
@RequestMapping(value = "/pets", method = RequestMethod.POST, params = {"username=jack"}, headers="Referer=http://www.ifeng.com/", consumes="application/json") 

//请求参数绑定
@RequestMapping("/testParam")
public String testParam(String username,String password){
    System.out.println("执行了...");
    System.out.println("用户名："+username);
    System.out.println("密码："+password);
    return "success";
}
执行了...
用户名：hehe
密码：123

```

更多[Spring MVC之@RequestMapping 详解](https://blog.csdn.net/kobejayandy/article/details/12690041)

#### @PropertySource
用于[@Configuration](#configuration)内，可以加载指定特定配置文件。

可与[@ConfigurationProperties](#@configurationproperties)配合使用。
```java
@PropertySource(value = "application.yml")
````

#### @ConfigurationProperties
用于[@Configuration](#configuration)、[@PropertySource](#propertysource)内，可以指定特定前缀，属性将自动装载。

也可用于带[@Bean](#bean)的方法，通过使用[@Autowired](#autowired)进行自动装配。
```java
@ConfigurationProperties(prefix = "spring.datasource.ds1")
```

更多见[spring boot 使用@ConfigurationProperties加载配置文件到类中](https://www.cnblogs.com/nizuimeiabc1/p/12173809.html)

#### @Mapper
用于接口，在编译时会自动生成实现类。

内部可以使用mybatis相关sql备注。

#### @Resource
```java
@Resource("名称")
```
同
```java
@Autowired
@Qualifier("名称")
```

#### @Autowired
用于属性接口，自动配置实现类。常与[@Qualifier](#qualifier)搭配使用，当有多个可自动配置方法时，用来指定特定的方法。

#### @Qualifier
常与[@Bean](#bean)及其子类搭配使用，在[@Bean](#bean)上指定名称从而使`@Qualifier`能够使用。

```java
@Qualifier("testInterface")
```

#### @Bean
包含子类
```java
@Repository("名称") //dao层
@Service("名称")    //service层
@Controller("名称") //web层
```

#### @MapperScan
将会自动扫描包[@Mapper](#mapper)并导入这些mapper。

也会扫描`resources`对应包的map.xml然后进行导入。

```java
@MapperScan({"com.kfit.demo","com.kfit.user"})
@MapperScan(basePackages = "com.mzd.multipledatasources.mapper.test01", sqlSessionFactoryRef = "test1SqlSessionFactory")
```

#### @Transactional
注解式事务。所有标记为这个注解的并且能被spring扫描到的方法都会根据@Transactional的配置来使用事务。

接口实现类或接口实现方法上。

当作用于类上时，该类的所有 public 方法将都具有该类型的事务属性，同时，我们也可以在方法级别使用该标注来覆盖类级别的定义。

默认配置下，spring 只有在抛出的异常为运行时 unchecked 异常时才回滚该事务

也就是抛出的异常为RuntimeException 的子类(Errors也会导致事务回滚)

而抛出 checked 异常则不会导致事务回滚 。可通过 @Transactional rollbackFor进行配置。

```java
@Transactional(
    value=?,                    //  指定事务管理器
    propagation=?               //  事务传播
    isolation=?,                //  事务隔离
    readOnly=?,                 //  读写
    timeout=?,                  //  超时 单位s
    rollbackFor=?,              //  会导致回滚的Class对象数组
    rollbackForClassName=?,     //  会导致回滚的Class名数组
    noRollbackFor=?,            //  不会导致回滚的Class对象数组
    noRollbackForClassName=?    //  不会导致回滚的Class名数组
)
```

isolation：
```java
@Transactional(isolation = Isolation.READ_UNCOMMITTED)//读取未提交数据(会出现脏读,不可重复读) 基本不使用
 
@Transactional(isolation = Isolation.READ_COMMITTED)//读取已提交数据(会出现不可重复读和幻读)
 
@Transactional(isolation = Isolation.REPEATABLE_READ)//可重复读(会出现幻读)
 
@Transactional(isolation = Isolation.SERIALIZABLE)//串行化
```

propagation：
```java
TransactionDefinition.PROPAGATION_REQUIRED
//如果当前存在事务，则加入该事务；如果当前没有事务，则创建一个新的事务。这是默认值。
 
TransactionDefinition.PROPAGATION_REQUIRES_NEW
//创建一个新的事务，如果当前存在事务，则把当前事务挂起。
 
TransactionDefinition.PROPAGATION_SUPPORTS
//如果当前存在事务，则加入该事务；如果当前没有事务，则以非事务的方式继续运行。
 
TransactionDefinition.PROPAGATION_NOT_SUPPORTED
//以非事务方式运行，如果当前存在事务，则把当前事务挂起。
 
TransactionDefinition.PROPAGATION_NEVER
//以非事务方式运行，如果当前存在事务，则抛出异常。
 
TransactionDefinition.PROPAGATION_MANDATORY
//如果当前存在事务，则加入该事务；如果当前没有事务，则抛出异常。
 
TransactionDefinition.PROPAGATION_NESTED
//如果当前存在事务，则创建一个事务作为当前事务的嵌套事务来运行；
//如果当前没有事务，则该取值等价于TransactionDefinition.PROPAGATION_REQUIRED。
```

[通常情况下，spring默认启动了事务管理器](https://zhaocunwei.blog.csdn.net/article/details/105924209)。

在mybatis中，[标准配置](http://mybatis.org/spring/zh/transactions.html#configuration)如下
```
@Bean(name = "txManager1")
public DataSourceTransactionManager txManager(DataSource dataSource) {
    return new DataSourceTransactionManager(dataSource);
}
```

更多[@Transactional 详解](https://blog.csdn.net/jiangyu1013/article/details/84397366)

#### @RequestMapping
```
@RequestMapping ( "/showView" )
public ModelAndView showView() {
    ModelAndView modelAndView = new ModelAndView();
    modelAndView.setViewName( "viewName" );
    modelAndView.addObject( " 需要放到 model 中的属性名称 " , " 对应的属性值，它是一个对象 " );
    return modelAndView;
}
```

[更多](https://www.cnblogs.com/hualishu/p/7398881.html)

#### @Controller
SpringMvc Controller对象，包含

[@RequestMapping](#requestmapping)

#### @SpringBootApplication
spring启动类，被此注解的类应在包的根上。

此注解包含[组件扫描](#componentScan)、[自动配置](#enableautoconfiguration)、[Spring配置](#springbootconfiguration)

#### @ComponentScan
组件扫描，默认扫描当前目录及子目录下的所有注释，并导入。

例子：
```java
@ComponentScan(
    value = "io.mieux",
    excludeFilters = {
        @Filter(
            type = FilterType.ANNOTATION,
            value = {Controller.class}
        )
    },
    useDefaultFilters = false
)
```

其中，`value`是全限定类名，`excludeFilters`是导入的类型，`useDefaultFilters`是扫描默认类型(@Component、@Repository、@Service 和 @Controller 标注的类)。

可使用多个`@ComponentScan`，但需要再加上`@Configuration`。

type的类型：
```java
public enum FilterType {
    ANNOTATION,
    ASSIGNABLE_TYPE,
    ASPECTJ,
    REGEX,
    CUSTOM
}
```

其中`CUSTOM`可以实现自定义规则，具体查看[Spring注解——使用@ComponentScan自动扫描组件](https://www.jianshu.com/p/64aac6461d5b)。

#### @SpringBootConfiguration
同`@Configuration`

#### @EnableAutoConfiguration
扫描并导入`@Configuration`
