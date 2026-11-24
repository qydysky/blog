---
title: mysql、oracle备忘记录
summary: 本文记录了mysql、oracle的常用操作。
tags:
  - mysql
  - oracle
toc: true
date: 2021-10-04T13:20:10+08:00
slug: database
---
# mysql、oracle备忘记录
---
# mysql
## 安装启动
debain安装mysql
[A Quick Guide to Using the MySQL APT Repository](https://dev.mysql.com/doc/mysql-apt-repo-quick-guide/en/)

## 连接退出
### 登录
```
qydysky@DESKTOP-5CV1EFA:~/下载$ mysql -h localhost -P 3306 -u root -p1wdvfe2
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 11
Server version: 8.0.23 MySQL Community Server - GPL

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> 
```
```
qydysky@DESKTOP-5CV1EFA:~/下载$ mysql -h localhost -P 3306 -u root -p
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 12
Server version: 8.0.23 MySQL Community Server - GPL

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> 
```
### 退出
```
mysql> exit
Bye
```

## mysql基本操作
### 查看mysql版本
```
qydysky@DESKTOP-5CV1EFA:~/下载$ mysql -V
mysql  Ver 8.0.23 for Linux on x86_64 (MySQL Community Server - GPL)
qydysky@DESKTOP-5CV1EFA:~/下载$ mysql --version
mysql  Ver 8.0.23 for Linux on x86_64 (MySQL Community Server - GPL)
```
> 先行执行登录mysql
```
mysql> select version();
+-----------+
| version() |
+-----------+
| 8.0.23    |
+-----------+
1 row in set (0.00 sec)
```
### 查看当前用户
```
mysql> select user();
+----------------+
| user()         |
+----------------+
| root@localhost |
+----------------+
1 row in set (0.00 sec)

```
### 查看所有数据库
```
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.00 sec)
```
### 查看当前数据库
```
mysql> select database();
+------------+
| database() |
+------------+
| mysql      |
+------------+
1 row in set (0.00 sec)
```
### 创建数据库
```
mysql> create database test;
Query OK, 1 row affected (0.14 sec)
```
### 删除数据库
```
mysql> drop database test;
Query OK, 0 rows affected (0.18 sec)
```
### 切换数据库
> 先行执行创建数据库
```
mysql> use test;
Database changed
```
### 查看库里的表
```
mysql> show tables;
Empty set (0.00 sec)
```
```
mysql> show tables from mysql;
+------------------------------------------------------+
| Tables_in_mysql                                      |
+------------------------------------------------------+
| columns_priv                                         |
| component                                            |
| db                                                   |
| default_roles                                        |
| engine_cost                                          |
| func                                                 |
| general_log                                          |
| global_grants                                        |
| gtid_executed                                        |
| help_category                                        |
| help_keyword                                         |
| help_relation                                        |
| help_topic                                           |
| innodb_index_stats                                   |
| innodb_table_stats                                   |
| password_history                                     |
| plugin                                               |
| procs_priv                                           |
| proxies_priv                                         |
| replication_asynchronous_connection_failover         |
| replication_asynchronous_connection_failover_managed |
| role_edges                                           |
| server_cost                                          |
| servers                                              |
| slave_master_info                                    |
| slave_relay_log_info                                 |
| slave_worker_info                                    |
| slow_log                                             |
| tables_priv                                          |
| time_zone                                            |
| time_zone_leap_second                                |
| time_zone_name                                       |
| time_zone_transition                                 |
| time_zone_transition_type                            |
| user                                                 |
+------------------------------------------------------+
35 rows in set (0.00 sec)
```
### 创建表
```
mysql> create table test(
    -> #数值类型
    -> Ttinyint tinyint,
    -> Tsmallint smallint,
    -> Tmediumint mediumint,
    -> Tint int,
    -> Tbigint bigint,
    -> Tfloat float,
    -> Tdouble double,
    -> Tdec dec(10,10),
    -> Tbit bit(1),
    -> #时间日期类型
    -> Tdate date,
    -> Tdatetime datetime,
    -> Ttimestamp timestamp,
    -> Ttime time,
    -> Tyear year,
    -> #字符串类型
    -> Tchar char(1),
    -> Tvarchar varchar(1),
    -> Ttinyblob tinyblob,
    -> Tblob blob,
    -> Tmediumblob mediumblob,
    -> Tlongblob longblob,
    -> Ttinytext tinytext,
    -> Ttext text,
    -> Tmediumtext mediumtext,
    -> Tlongtext longtext,
    -> Tvarbinary varbinary(1),
    -> Tbinary binary(1)
    -> );
Query OK, 0 rows affected (0.63 sec)
```
### 查看表结构
```
mysql> desc test;
+-------------+----------------+------+-----+---------+-------+
| Field       | Type           | Null | Key | Default | Extra |
+-------------+----------------+------+-----+---------+-------+
| Ttinyint    | tinyint        | YES  |     | NULL    |       |
| Tsmallint   | smallint       | YES  |     | NULL    |       |
| Tmediumint  | mediumint      | YES  |     | NULL    |       |
| Tint        | int            | YES  |     | NULL    |       |
| Tbigint     | bigint         | YES  |     | NULL    |       |
| Tfloat      | float          | YES  |     | NULL    |       |
| Tdouble     | double         | YES  |     | NULL    |       |
| Tdec        | decimal(10,10) | YES  |     | NULL    |       |
| Tbit        | bit(1)         | YES  |     | NULL    |       |
| Tdate       | date           | YES  |     | NULL    |       |
| Tdatetime   | datetime       | YES  |     | NULL    |       |
| Ttimestamp  | timestamp      | YES  |     | NULL    |       |
| Ttime       | time           | YES  |     | NULL    |       |
| Tyear       | year           | YES  |     | NULL    |       |
| Tchar       | char(1)        | YES  |     | NULL    |       |
| Tvarchar    | varchar(1)     | YES  |     | NULL    |       |
| Ttinyblob   | tinyblob       | YES  |     | NULL    |       |
| Tblob       | blob           | YES  |     | NULL    |       |
| Tmediumblob | mediumblob     | YES  |     | NULL    |       |
| Tlongblob   | longblob       | YES  |     | NULL    |       |
| Ttinytext   | tinytext       | YES  |     | NULL    |       |
| Ttext       | text           | YES  |     | NULL    |       |
| Tmediumtext | mediumtext     | YES  |     | NULL    |       |
| Tlongtext   | longtext       | YES  |     | NULL    |       |
| Tvarbinary  | varbinary(1)   | YES  |     | NULL    |       |
| Tbinary     | binary(1)      | YES  |     | NULL    |       |
+-------------+----------------+------+-----+---------+-------+
26 rows in set (0.03 sec)
```

### 删除表
```
mysql> drop table test;
Query OK, 0 rows affected (0.32 sec)
```
### 向表添加元素
> 先行执行创建表
```
mysql> insert into test (Tint,Tvarchar) values(1,'1');
Query OK, 1 row affected (0.13 sec)
```
### 查看表所有元素
```
mysql> mysql> select * from test;
+----------+-----------+------------+------+---------+--------+---------+------+------------+-------+-----------+------------+-------+-------+-------+----------+----------------------+--------------+--------------------------+----------------------+-----------+-------+-------------+-----------+------------------------+------------------+
| Ttinyint | Tsmallint | Tmediumint | Tint | Tbigint | Tfloat | Tdouble | Tdec | Tbit       | Tdate | Tdatetime | Ttimestamp | Ttime | Tyear | Tchar | Tvarchar | Ttinyblob            | Tblob        | Tmediumblob              | Tlongblob            | Ttinytext | Ttext | Tmediumtext | Tlongtext | Tvarbinary             | Tbinary          |
+----------+-----------+------------+------+---------+--------+---------+------+------------+-------+-----------+------------+-------+-------+-------+----------+----------------------+--------------+--------------------------+----------------------+-----------+-------+-------------+-----------+------------------------+------------------+
|     NULL |      NULL |       NULL |    1 |    NULL |   NULL |    NULL | NULL | NULL       | NULL  | NULL      | NULL       | NULL  |  NULL | NULL  | 1        | NULL                 | NULL         | NULL                     | NULL                 | NULL      | NULL  | NULL        | NULL      | NULL                   | NULL             |
+----------+-----------+------------+------+---------+--------+---------+------+------------+-------+-----------+------------+-------+-------+-------+----------+----------------------+--------------+--------------------------+----------------------+-----------+-------+-------------+-----------+------------------------+------------------+
1 row in set (0.00 sec)
```
### 更新表元素
```
mysql> update test set Tvarchar='2' where Tint=1;
Query OK, 1 row affected (0.11 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> select Tint,Tvarchar from test;
+------+----------+
| Tint | Tvarchar |
+------+----------+
|    1 | 2        |
+------+----------+
1 row in set (0.00 sec)
```
### 删除表元素
```
mysql> delete from test where Tint=1;
Query OK, 1 row affected (0.11 sec)

mysql> delete from test;
Query OK, 0 rows affected (0.00 sec)

mysql> select * from test;
Empty set (0.00 sec)
```

## 列属性
### 修改列属性
先创建表

```sql
create database test;
create table test.test (
	id int,
	info varchar(20)
);
```

修改列属性

```sql
alter table test.test modify column info varchar(50);
```

修改为自增
```sql
alter table videocardprice change id id int primary key auto_increment;
```

修改为主键自增
```sql
ALTER TABLE videocardprice MODIFY COLUMN id int primary key auto_increment;
```

### 添加列属性
先创建表

```sql
drop table test.test;
create table test.test (
	id int,
	info varchar(20)
);
```

添加索引

```sql
alter table test.test add index(id);
```

添加唯一索引

```sql
alter table test.test add unique(id);
```

添加主键

```sql
alter table test.test add primary key(id);
```

### 删除列属性
删除主键

```sql
alter table test.test drop primary key;
```

删除主键自增
```sql
ALTER TABLE test.test MODIFY COLUMN id int;
```

删除索引

```sql
alter table test.test drop index id;
```

## 基础查询
### 查询字段
先行插入元素
```
mysql> insert into test (Tint) values(1);
Query OK, 1 row affected (0.09 sec)
```

```
mysql> select Tint from test;
+------+
| Tint |
+------+
|    1 |
+------+
1 row in set (0.00 sec)

mysql> select Tint,`Tvarchar` from test;
+------+----------+
| Tint | Tvarchar |
+------+----------+
|    1 | NULL     |
+------+----------+
1 row in set (0.00 sec)

mysql> select * from test;
+----------+-----------+------------+------+---------+--------+---------+------+------------+-------+-----------+------------+-------+-------+-------+----------+----------------------+--------------+--------------------------+----------------------+-----------+-------+-------------+-----------+------------------------+------------------+
| Ttinyint | Tsmallint | Tmediumint | Tint | Tbigint | Tfloat | Tdouble | Tdec | Tbit       | Tdate | Tdatetime | Ttimestamp | Ttime | Tyear | Tchar | Tvarchar | Ttinyblob            | Tblob        | Tmediumblob              | Tlongblob            | Ttinytext | Ttext | Tmediumtext | Tlongtext | Tvarbinary             | Tbinary          |
+----------+-----------+------------+------+---------+--------+---------+------+------------+-------+-----------+------------+-------+-------+-------+----------+----------------------+--------------+--------------------------+----------------------+-----------+-------+-------------+-----------+------------------------+------------------+
|     NULL |      NULL |       NULL |    1 |    NULL |   NULL |    NULL | NULL | NULL       | NULL  | NULL      | NULL       | NULL  |  NULL | NULL  | NULL     | NULL                 | NULL         | NULL                     | NULL                 | NULL      | NULL  | NULL        | NULL      | NULL                   | NULL             |
+----------+-----------+------------+------+---------+--------+---------+------+------------+-------+-----------+------------+-------+-------+-------+----------+----------------------+--------------+--------------------------+----------------------+-----------+-------+-------------+-----------+------------------------+------------------+
1 row in set (0.00 sec)
```
### 特殊字段名查询
先行创建特殊表，插入值
```
mysql> create table test( `int` int );
Query OK, 0 rows affected (0.89 sec)

mysql> insert into test (`int`) values(1);
Query OK, 1 row affected (0.16 sec)
```

```
mysql> select `int` from test;
+------+
| int  |
+------+
|    1 |
+------+
1 row in set (0.00 sec)
```
### 常量、函数、表达式查询
```
mysql> select 123,'aasd',concat('1','a',ifnull(null,'1')),9%2,1+1,1+'1',1+'a',1+null;
+-----+------+----------------------------------+------+-----+-------+-------+--------+
| 123 | aasd | concat('1','a',ifnull(null,'1')) | 9%2  | 1+1 | 1+'1' | 1+'a' | 1+null |
+-----+------+----------------------------------+------+-----+-------+-------+--------+
| 123 | aasd | 1a1                              |    1 |   2 |     2 |     1 |   NULL |
+-----+------+----------------------------------+------+-----+-------+-------+--------+
1 row in set, 1 warning (0.00 sec)
```
### 别名
```
mysql> select 123 数字,'aasd' as `字符串`,version() "版本",9%2 as '表达式out';
+--------+-----------+--------+--------------+
| 数字   | 字符串    | 版本   | 表达式out    |
+--------+-----------+--------+--------------+
|    123 | aasd      | 8.0.23 |            1 |
+--------+-----------+--------+--------------+
1 row in set (0.00 sec)
```
先行创建表，插入值
```
mysql> select 别名.id 
    -> from test0 as 别名
    -> where true;
+------+
| id   |
+------+
|    1 |
+------+
1 row in set (0.00 sec)

mysql> select test0.id from test0 as 别名;
ERROR 1054 (42S22): Unknown column 'test0.id' in 'field list'

mysql> select id from test0 as 别名;
+------+
| id   |
+------+
|    1 |
+------+
1 row in set (0.00 sec)
```

### 查询结果去重
先行创建特殊表，插入重复值
```
mysql> drop table test;
Query OK, 0 rows affected (0.54 sec)

mysql> create table test(
    -> `int` int,
    -> `varchar` varchar(1)
    -> );
Query OK, 0 rows affected (0.57 sec)

mysql> insert into test (`int`,`varchar`) values(1,'1');
Query OK, 1 row affected (0.14 sec)

mysql> insert into test (`int`,`varchar`) values(1,'2');
Query OK, 1 row affected (0.14 sec)

mysql> insert into test (`int`,`varchar`) values(1,'2');
Query OK, 1 row affected (0.10 sec)

mysql> select * from test;
+------+---------+
| int  | varchar |
+------+---------+
|    1 | 1       |
|    1 | 2       |
|    1 | 2       |
+------+---------+
3 rows in set (0.00 sec)
```

```
mysql> select distinct * from test;
+------+---------+
| int  | varchar |
+------+---------+
|    1 | 1       |
|    1 | 2       |
+------+---------+
2 rows in set (0.02 sec)
```
```
mysql> select distinct `int` from test;
+------+
| int  |
+------+
|    1 |
+------+
1 row in set (0.00 sec)
```

## 条件查询
### 查询字段
先行创建表，插入元素
```
mysql> create table test(
    -> a int,
    -> b varchar(10),
    -> c int
    -> );
Query OK, 0 rows affected (0.59 sec)

mysql> insert into test (a,b,c)
    -> values
    -> (1,'1',1),
    -> (2,'1',2)
    -> ;
Query OK, 2 rows affected (0.15 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> select * from test;
+------+------+------+
| a    | b    | c    |
+------+------+------+
|    1 | 1    |    1 |
|    2 | 1    |    2 |
+------+------+------+
2 rows in set (0.00 sec)
```
### 条件、逻辑运算、安全等于
```
mysql> select a,b,c from test where a=1;
+------+------+------+
| a    | b    | c    |
+------+------+------+
|    1 | 1    |    1 |
+------+------+------+
1 row in set (0.00 sec)

mysql> select a,b,c from test where a=1 || a=2;
+------+------+------+
| a    | b    | c    |
+------+------+------+
|    1 | 1    |    1 |
|    2 | 1    |    2 |
+------+------+------+
2 rows in set, 1 warning (0.00 sec)

mysql> select a,b,c from test where a=1 or a=2;
+------+------+------+
| a    | b    | c    |
+------+------+------+
|    1 | 1    |    1 |
|    2 | 1    |    2 |
+------+------+------+
2 rows in set (0.00 sec)

mysql> select a,b,c from test where a=1 && a=2;
Empty set, 1 warning (0.00 sec)

mysql> select a,b,c from test where a=1 and a=2;
Empty set (0.00 sec)

mysql> select a,b,c from test where not(a=1);
+------+------+------+
| a    | b    | c    |
+------+------+------+
|    2 | 1    |    2 |
+------+------+------+
1 row in set (0.00 sec)
```
```
mysql> select a,b,c from test where a>=1;
+------+------+------+
| a    | b    | c    |
+------+------+------+
|    1 | 1    |    1 |
|    2 | 1    |    2 |
+------+------+------+
2 rows in set (0.01 sec)
```
```
mysql> select a,b,c from test where a!=1;
+------+------+------+
| a    | b    | c    |
+------+------+------+
|    2 | 1    |    2 |
+------+------+------+
1 row in set (0.00 sec)
```
```
mysql> select a,b,c from test where a<>1;
+------+------+------+
| a    | b    | c    |
+------+------+------+
|    2 | 1    |    2 |
+------+------+------+
1 row in set (0.00 sec)
```
```
mysql> select * from test where name <=> null;
+------+------+
| id   | name |
+------+------+
|    5 | NULL |
+------+------+
1 row in set (0.00 sec)
```
```
mysql> select 1 from dual where 1 between 0 and 2;
+---+
| 1 |
+---+
| 1 |
+---+
1 row in set (0.00 sec)
```
### 模糊查询
先行重新创建表，插入元素
```
mysql> create table test(
    -> id int,
    -> name varchar(20)
    -> );
Query OK, 0 rows affected (0.50 sec)

mysql> insert into test (id,name) values (1,'werdf'), (2,'sfowedf'), (3,'qwepcv')， (4,'we_r')， (5,null);
Query OK, 5 rows affected (0.13 sec)
Records: 5  Duplicates: 0  Warnings: 0
```

```
mysql> select * from test where name like '___d%';
+------+-------+
| id   | name  |
+------+-------+
|    1 | werdf |
+------+-------+
1 row in set (0.00 sec)

mysql> select * from test where name like '%\_%';
+------+------+
| id   | name |
+------+------+
|    4 | we_r |
+------+------+
1 row in set (0.00 sec)

mysql> select * from test where name like '%$_%' escape '$';
+------+------+
| id   | name |
+------+------+
|    4 | we_r |
+------+------+
1 row in set (0.00 sec)

mysql> select * from test where id between 1 and 3;
+------+---------+
| id   | name    |
+------+---------+
|    1 | werdf   |
|    2 | sfowedf |
|    3 | qwepcv  |
+------+---------+
3 rows in set (0.00 sec)

mysql> select * from test where id in(1,3);
+------+--------+
| id   | name   |
+------+--------+
|    1 | werdf  |
|    3 | qwepcv |
+------+--------+
2 rows in set (0.00 sec)

mysql> select * from test where name is null;
+------+------+
| id   | name |
+------+------+
|    5 | NULL |
+------+------+
1 row in set (0.00 sec)

mysql> select * from test where name is not null;
+------+---------+
| id   | name    |
+------+---------+
|    1 | werdf   |
|    2 | sfowedf |
|    3 | qwepcv  |
|    4 | we_r    |
+------+---------+
4 rows in set (0.00 sec)
```

## 排序查询
事先插入元素
```
mysql> insert into test (id,name) values
    -> (5,'abc'),
    -> (5,'bcd');
Query OK, 2 rows affected (0.11 sec)
Records: 2  Duplicates: 0  Warnings: 0
```

```
mysql> select id,name,id%2 新id,ifnull(length(name),0) name字节长度 from test order by 新id desc, name字节长度 asc;
+------+---------+-------+------------------+
| id   | name    | 新id  | name字节长度     |
+------+---------+-------+------------------+
|    5 | NULL    |     1 |                0 |
|    5 | abc     |     1 |                3 |
|    5 | bcd     |     1 |                3 |
|    1 | werdf   |     1 |                5 |
|    3 | qwepcv  |     1 |                6 |
|    4 | we_r    |     0 |                4 |
|    2 | sfowedf |     0 |                7 |
+------+---------+-------+------------------+
7 rows in set (0.00 sec)
```

## 常用函数
### 字符函数
```
mysql> select length('号'),concat('1','2'),upper('aSd'),lower('aSd'),substr('123456',4),substr('123456',2,7),instr('123','2'),trim(' aa '),trim('s' from 'sas'),lpad('ab',1,'s'),rpad('a',10,'s'),replace('123451','1','0');
+---------------+-----------------+--------------+--------------+--------------------+----------------------+------------------+--------------+----------------------+------------------+------------------+---------------------------+
| length('号')  | concat('1','2') | upper('aSd') | lower('aSd') | substr('123456',4) | substr('123456',2,7) | instr('123','2') | trim(' aa ') | trim('s' from 'sas') | lpad('ab',1,'s') | rpad('a',10,'s') | replace('123451','1','0') |
+---------------+-----------------+--------------+--------------+--------------------+----------------------+------------------+--------------+----------------------+------------------+------------------+---------------------------+
|             3 | 12              | ASD          | asd          | 456                | 23456                |                2 | aa           | a                    | a                | asssssssss       | 023450                    |
+---------------+-----------------+--------------+--------------+--------------------+----------------------+------------------+--------------+----------------------+------------------+------------------+---------------------------+
1 row in set (0.00 sec)
```
### 数学函数
```
mysql> select round(1.45,1),round(1.5),round(-1.4),round(-1.5);
+---------------+------------+-------------+-------------+
| round(1.45,1) | round(1.5) | round(-1.4) | round(-1.5) |
+---------------+------------+-------------+-------------+
|           1.5 |          2 |          -1 |          -2 |
+---------------+------------+-------------+-------------+
1 row in set (0.00 sec)

mysql> select ceil(-1.2),floor(-1.2);
+------------+-------------+
| ceil(-1.2) | floor(-1.2) |
+------------+-------------+
|         -1 |          -2 |
+------------+-------------+
1 row in set (0.00 sec)

mysql> select truncate(1.415,2);
+-------------------+
| truncate(1.415,2) |
+-------------------+
|              1.41 |
+-------------------+
1 row in set (0.00 sec)

#a-a/b*b
mysql> select mod(10,-3),10%-3,rand();
+------------+-------+----------------------+
| mod(10,-3) | 10%-3 | rand()               |
+------------+-------+----------------------+
|          1 |     1 | 0.015591944582380304 |
+------------+-------+----------------------+
1 row in set (0.00 sec)
```
### 时间函数
```
mysql> select now(),curdate(),curtime(),year(now()),year('1998-01-23'),month(now()),monthname(now()),day(now()),hour(now()),minute(now()),second(now());
+---------------------+------------+-----------+-------------+--------------------+--------------+------------------+------------+-------------+---------------+---------------+
| now()               | curdate()  | curtime() | year(now()) | year('1998-01-23') | month(now()) | monthname(now()) | day(now()) | hour(now()) | minute(now()) | second(now()) |
+---------------------+------------+-----------+-------------+--------------------+--------------+------------------+------------+-------------+---------------+---------------+
| 2021-02-25 21:16:37 | 2021-02-25 | 21:16:37  |        2021 |               1998 |            2 | February         |         25 |          21 |            16 |            37 |
+---------------------+------------+-----------+-------------+--------------------+--------------+------------------+------------+-------------+---------------+---------------+
1 row in set (0.01 sec)

mysql> select now(),str_to_date('1988-01-22 23:20:11','%Y-%m-%d %H:%i:%s'),date_format(now(),'%y %c %h');
+---------------------+--------------------------------------------------------+-------------------------------+
| now()               | str_to_date('1988-01-22 23:20:11','%Y-%m-%d %H:%i:%s') | date_format(now(),'%y %c %h') |
+---------------------+--------------------------------------------------------+-------------------------------+
| 2021-02-25 21:04:29 | 1988-01-22 23:20:11                                    | 21 2 09                       |
+---------------------+--------------------------------------------------------+-------------------------------+
1 row in set (0.00 sec)

mysql> select datediff(now(),'2000-01-01 00:00:01');
+---------------------------------------+
| datediff(now(),'2000-01-01 00:00:01') |
+---------------------------------------+
|                                  7726 |
+---------------------------------------+
1 row in set (0.00 sec)
```
其中`year()`等可用于`group by`中，从而实现时间分组。

时间加减
```sql
mysql> select now() as now,
    -> date_add(now(),interval 1 day) as tomorrow,
    -> date_sub(now(),interval 1 day) as yesterday;
+---------------------+---------------------+---------------------+
| now                 | tomorrow            | yesterday           |
+---------------------+---------------------+---------------------+
| 2021-10-05 09:46:31 | 2021-10-06 09:46:31 | 2021-10-04 09:46:31 |
+---------------------+---------------------+---------------------+
1 row in set (0.00 sec)
```

### 流程控制函数
```
mysql> select if('a' is null, '是nulll', '不是null');
+-------------------------------------------+
| if('a' is null, '是nulll', '不是null')    |
+-------------------------------------------+
| 不是null                                  |
+-------------------------------------------+
1 row in set (0.00 sec)

mysql> select case 'a' is null
    -> when true then '是null'
    -> else '不是null'
    -> end as `'a' is null ?`;
+---------------+
| 'a' is null ? |
+---------------+
| 不是null      |
+---------------+
1 row in set (0.00 sec)

mysql> select case 
    -> when 'a' is null then 'a是null'
    -> when null is null then 'null是null'
    -> else '默认选项'
    -> end as 判断;
+-------------+
| 判断        |
+-------------+
| null是null  |
+-------------+
1 row in set (0.00 sec)
```
### 分组函数(统计函数)
先行重新创建表，插入数据
```
mysql> create table test(
    -> num float,
    -> name varchar(20)
    -> );
Query OK, 0 rows affected (0.91 sec)

mysql> insert into test (num,name) values
    -> (0.5,'askdjfj'),
    -> (0.7,'zskdjfj'),
    -> (null,'pwoeir');
Query OK, 3 rows affected (0.13 sec)
Records: 3  Duplicates: 0  Warnings: 0
```

```
mysql> select sum(num),avg(num),min(num),max(num),count(num) from test;
+-------------------+--------------------+----------+----------+------------+
| sum(num)          | avg(num)           | min(num) | max(num) | count(num) |
+-------------------+--------------------+----------+----------+------------+
| 1.199999988079071 | 0.5999999940395355 |      0.5 |      0.7 |          2 |
+-------------------+--------------------+----------+----------+------------+
1 row in set (0.00 sec)

mysql> select min(name),max(name),count(name) from test;
+-----------+-----------+-------------+
| min(name) | max(name) | count(name) |
+-----------+-----------+-------------+
| askdjfj   | zskdjfj   |           3 |
+-----------+-----------+-------------+
1 row in set (0.00 sec)
```
先行插入
```
mysql> insert into test (num,name) values (0.5,'fffff');
Query OK, 1 row affected (0.10 sec)
```

```
mysql> select sum(num),sum(distinct num),avg(num),avg(distinct num),count(distinct num) from test;
+-------------------+-------------------+--------------------+--------------------+---------------------+
| sum(num)          | sum(distinct num) | avg(num)           | avg(distinct num)  | count(distinct num) |
+-------------------+-------------------+--------------------+--------------------+---------------------+
| 1.699999988079071 | 1.199999988079071 | 0.5666666626930237 | 0.5999999940395355 |                   2 |
+-------------------+-------------------+--------------------+--------------------+---------------------+
1 row in set (0.00 sec)
```

```
mysql> select count(*) as `有值行数`,count(2) as `1列中全部行为2时的2个数` from test;
+--------------+-----------------------------------+
| 有值行数     | 1列中全部行为2时的2个数           |
+--------------+-----------------------------------+
|            4 |                                 4 |
+--------------+-----------------------------------+
1 row in set (0.01 sec)
```
### 摘要函数
```
mysql> select md5('adfasd'),sha('asdfasdf');
+----------------------------------+------------------------------------------+
| md5('adfasd')                    | sha('asdfasdf')                          |
+----------------------------------+------------------------------------------+
| 1cf04619d373e41edbd850ba66237d96 | 92429d82a41e930486c6de5ebda9602d55c39986 |
+----------------------------------+------------------------------------------+
1 row in set (0.00 sec)
```

## 分组查询
先行创建表，并插入值
```
mysql> create table test(
    -> a int,
    -> b int,
    -> c int);
Query OK, 0 rows affected (0.57 sec)

mysql> insert into test (a,b,c) values
    -> (1,2,3),
    -> (1,3,4),
    -> (2,4,5),
    -> (2,5,4),
    -> (2,5,5);
Query OK, 5 rows affected (0.13 sec)
Records: 5  Duplicates: 0  Warnings: 0
```
```
mysql> select max(b) as 最高,a
    -> from test
    -> where c>0
    -> group by a
    -> having 最高>4
    -> ;
+--------+------+
| 最高   | a    |
+--------+------+
|      5 |    2 |
+--------+------+
1 row in set (0.00 sec)

mysql> select max(b) as 最高,a,c from test group by a,c having 最高>2;
+--------+------+------+
| 最高   | a    | c    |
+--------+------+------+
|      3 |    1 |    4 |
|      5 |    2 |    5 |
|      5 |    2 |    4 |
+--------+------+------+
3 rows in set (0.00 sec)
```

## 连接查询
### 等值连接
先行重新创建表，插入值
```
mysql> create table test( 
    -> a1 int,
    -> a2 int);
Query OK, 0 rows affected (0.51 sec)

mysql> create table test2(
    -> b1 int,
    -> b2 int);
Query OK, 0 rows affected (0.97 sec)

mysql> insert into test (a1,a2) values
    -> (1,1),
    -> (2,2);
Query OK, 2 rows affected (0.29 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> insert into test2 (b1,b2) values (1,3), (2,4);
Query OK, 2 rows affected (0.11 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> select * from test;
+------+------+
| a1   | a2   |
+------+------+
|    1 |    1 |
|    2 |    2 |
+------+------+
2 rows in set (0.00 sec)

mysql> select * from test2;
+------+------+
| b1   | b2   |
+------+------+
|    1 |    3 |
|    2 |    4 |
+------+------+
2 rows in set (0.00 sec)
```

```
mysql> select test.a1,t2.`b2` 
    -> from test2 as t2,test
    -> where test.`a2`=t2.b1
    -> and test.a1>1;
+------+------+
| a1   | b2   |
+------+------+
|    2 |    4 |
+------+------+
1 row in set (0.00 sec)
```
先行重新创建表，插入值
```
mysql> create table 表1(
    -> 值1 int,
    -> 连接值 int,
    -> 组值 int);
Query OK, 0 rows affected (0.97 sec)

mysql> create table 表2(
    -> 值2 int,
    -> 连接值 int,
    -> 组值 int);
Query OK, 0 rows affected (0.51 sec)

mysql> create table 表3(
    -> 值3 int,
    -> 连接值 int,
    -> 组值 int);
Query OK, 0 rows affected (0.60 sec)

mysql> insert into 表1 (值1,连接值,组值) values 
    -> (1,1,1),
    -> (2,3,1),
    -> (3,2,5),
    -> (4,2,5);
Query OK, 4 rows affected (0.13 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql> insert into 表2 (值2,连接值,组值) values
    -> (9,3,2),
    -> (10,3,3),
    -> (11,2,1);
Query OK, 3 rows affected (0.09 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> insert into 表3 (值3,连接值,组值) values
    -> (5,1,1),
    -> (6,2,1),
    -> (7,3,2);
Query OK, 3 rows affected (0.10 sec)
Records: 3  Duplicates: 0  Warnings: 0
```

```
mysql> select * from 表1,表2,表3 where 表1.连接值=表2.连接值 and 表2.组值=表3.组值;
+------+-----------+--------+------+-----------+--------+------+-----------+--------+
| 值1  | 连接值    | 组值   | 值2  | 连接值    | 组值   | 值3  | 连接值    | 组值   |
+------+-----------+--------+------+-----------+--------+------+-----------+--------+
|    2 |         3 |      1 |    9 |         3 |      2 |    7 |         3 |      2 |
|    3 |         2 |      5 |   11 |         2 |      1 |    6 |         2 |      1 |
|    3 |         2 |      5 |   11 |         2 |      1 |    5 |         1 |      1 |
|    4 |         2 |      5 |   11 |         2 |      1 |    6 |         2 |      1 |
|    4 |         2 |      5 |   11 |         2 |      1 |    5 |         1 |      1 |
+------+-----------+--------+------+-----------+--------+------+-----------+--------+
5 rows in set (0.00 sec)

mysql> select count(*),t2.组值 as 分组依据值 
    -> from 表1 t1,表2 t2
    -> where t1.连接值=t2.连接值
    -> group by 分组依据值
    -> order by count(*) desc;
+----------+-----------------+
| count(*) | 分组依据值      |
+----------+-----------------+
|        2 |               1 |
|        1 |               3 |
|        1 |               2 |
+----------+-----------------+
3 rows in set (0.00 sec)

mysql> select * from 表1,表2,表3
    -> where 表1.连接值=表2.连接值 and 表1.连接值=表3.连接值;
+------+-----------+--------+------+-----------+--------+------+-----------+--------+
| 值1  | 连接值    | 组值   | 值2  | 连接值    | 组值   | 值3  | 连接值    | 组值   |
+------+-----------+--------+------+-----------+--------+------+-----------+--------+
|    2 |         3 |      1 |    9 |         3 |      2 |    7 |         3 |      2 |
|    2 |         3 |      1 |   10 |         3 |      3 |    7 |         3 |      2 |
|    3 |         2 |      5 |   11 |         2 |      1 |    6 |         2 |      1 |
|    4 |         2 |      5 |   11 |         2 |      1 |    6 |         2 |      1 |
+------+-----------+--------+------+-----------+--------+------+-----------+--------+
4 rows in set (0.00 sec)

mysql> select count(*),t2.组值 as 分组依据值 
    -> from 表1 t1,表2 t2
    -> where t1.连接值=t2.连接值
    -> group by 分组依据值
    -> order by count(*) desc;
+----------+-----------------+
| count(*) | 分组依据值      |
+----------+-----------------+
|        2 |               1 |
|        1 |               3 |
|        1 |               2 |
+----------+-----------------+
3 rows in set (0.00 sec)

mysql> select count(*) 个数,t2.组值 分组依据值
    -> from 表1 t1
    -> inner join 表2 t2
    -> on t1.连接值=t2.连接值
    -> inner join 表3 t3
    -> on t1.连接值=t3.连接值 
    -> group by 分组依据值
    -> order by 个数 desc;
+--------+-----------------+
| 个数   | 分组依据值      |
+--------+-----------------+
|      2 |               1 |
|      1 |               2 |
|      1 |               3 |
+--------+-----------------+
3 rows in set (0.00 sec)
```
### 非等值连接
先行创建表，插入值
```
mysql> create table 表1(
    -> 值1 int,
    -> 连接值 int);
Query OK, 0 rows affected (0.57 sec)

mysql> create table 表2(
    -> 值2 varchar(10),
    -> 连接低值 int,
    -> 连接高值 int);
Query OK, 0 rows affected (0.61 sec)

mysql> insert into 表1 (值1,连接值) values
    -> (1,2),
    -> (2,4),
    -> (3,9);
Query OK, 3 rows affected (0.10 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> insert into 表2 (值2,连接低值,连接高值) values
    -> ('A',0,3),
    -> ('B',3,6),
    -> ('c',6,10);
Query OK, 3 rows affected (0.15 sec)
Records: 3  Duplicates: 0  Warnings: 0
```

```
mysql> select 值2,值1 from 表1,表2 where 连接值 between 连接低值 and 连接高值;
+------+------+
| 值2  | 值1  |
+------+------+
| A    |    1 |
| B    |    2 |
| c    |    3 |
+------+------+
3 rows in set (0.01 sec)

mysql> select 值2,值1
    -> from 表1
    -> inner join 表2
    -> on 连接值 between 连接低值 and 连接高值
    -> order by 值1 desc;
+------+------+
| 值2  | 值1  |
+------+------+
| C    |    3 |
| B    |    2 |
| A    |    1 |
+------+------+
3 rows in set (0.00 sec)
```
### 自连接
先行创建表，并插入值
```
mysql> create table 自连接表( 
    -> id int,
    -> parent_id int);
Query OK, 0 rows affected (0.62 sec)

mysql> insert into 自连接表 (id,parent_id) values
    -> (1,0),
    -> (2,1),
    -> (3,1);
Query OK, 3 rows affected (0.10 sec)
Records: 3  Duplicates: 0  Warnings: 0
```

```
mysql> select a.id 子id,a.parent_id 指向的父id,b.parent_id 父id的父id
    -> from 自连接表 a,自连接表 b
    -> where a.parent_id=b.id;
+-------+----------------+---------------+
| 子id  | 指向的父id     | 父id的父id    |
+-------+----------------+---------------+
|     3 |              1 |             0 |
|     2 |              1 |             0 |
+-------+----------------+---------------+
2 rows in set (0.00 sec)

mysql> select a.id 子id,a.parent_id 指向的父id,b.parent_id 父id的父id
    -> from 自连接表 a
    -> inner join 自连接表 b
    -> on a.parent_id=b.id;
+-------+----------------+---------------+
| 子id  | 指向的父id     | 父id的父id    |
+-------+----------------+---------------+
|     3 |              1 |             0 |
|     2 |              1 |             0 |
+-------+----------------+---------------+
2 rows in set (0.00 sec)
```
### 左、右、全外连接
先行创建表，并插入值
```
mysql> create table t1(
    -> id int,
    -> a1 int);
Query OK, 0 rows affected (0.89 sec)

mysql> create table t2( id int, a2 int);                           
Query OK, 0 rows affected (0.59 sec)

mysql> insert into t1 (id,a1) values
    -> (1,1),
    -> (2,2),
    -> (3,3);
Query OK, 3 rows affected (0.12 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> insert into t2 (id,a2) values (1,1), (4,4), (3,3);
Query OK, 3 rows affected (0.11 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> create table t3(
    -> id int,
    -> a3 int);
Query OK, 0 rows affected (0.56 sec)

mysql> insert into t3 (id,a3) values (1,1), (4,4), (5,5);
Query OK, 3 rows affected (0.14 sec)
Records: 3  Duplicates: 0  Warnings: 0
```
```
mysql> select * from t1,t2
    -> ^C
mysql> select * from t1
    -> left outer join t2 
    -> on t1.a1=t2.id;
+------+------+------+------+
| id   | a1   | id   | a2   |
+------+------+------+------+
|    1 |    1 |    1 |    1 |
|    2 |    2 | NULL | NULL |
|    3 |    3 |    3 |    3 |
+------+------+------+------+
3 rows in set (0.00 sec)

mysql> select * from t1
    -> right outer join t2
    -> on t1.a1=t2.id;
+------+------+------+------+
| id   | a1   | id   | a2   |
+------+------+------+------+
|    1 |    1 |    1 |    1 |
| NULL | NULL |    4 |    4 |
|    3 |    3 |    3 |    3 |
+------+------+------+------+
3 rows in set (0.00 sec)

mysql> select * from t2
    -> right outer join t1
    -> on t1.a1=t2.id;
+------+------+------+------+
| id   | a2   | id   | a1   |
+------+------+------+------+
|    1 |    1 |    1 |    1 |
| NULL | NULL |    2 |    2 |
|    3 |    3 |    3 |    3 |
+------+------+------+------+
3 rows in set (0.01 sec)

mysql> select * from t1
    -> left outer join t2 on t1.id=t2.id
    -> left outer join t3 on t2.id=t3.id;
+------+------+------+------+------+------+
| id   | a1   | id   | a2   | id   | a3   |
+------+------+------+------+------+------+
|    1 |    1 |    1 |    1 |    1 |    1 |
|    2 |    2 | NULL | NULL | NULL | NULL |
|    3 |    3 |    3 |    3 | NULL | NULL |
+------+------+------+------+------+------+
3 rows in set (0.00 sec)

mysql> select * from t1
    -> left outer join t2 on t1.id=t2.id
    -> right outer join t3 on t2.id=t3.id;
+------+------+------+------+------+------+
| id   | a1   | id   | a2   | id   | a3   |
+------+------+------+------+------+------+
|    1 |    1 |    1 |    1 |    1 |    1 |
| NULL | NULL | NULL | NULL |    4 |    4 |
| NULL | NULL | NULL | NULL |    5 |    5 |
+------+------+------+------+------+------+
3 rows in set (0.00 sec)

mysql> select * from t2 right outer join t1 on t1.a1=t2.id
    -> union
    -> select * from t2 left outer join t1 on t1.a1=t2.id;
+------+------+------+------+
| id   | a2   | id   | a1   |
+------+------+------+------+
|    1 |    1 |    1 |    1 |
| NULL | NULL |    2 |    2 |
|    3 |    3 |    3 |    3 |
|    4 |    4 | NULL | NULL |
+------+------+------+------+
4 rows in set (0.01 sec)
```
### 交叉连接
```
mysql> select * from t1
    -> cross join t2;
+------+------+------+------+
| id   | a1   | id   | a2   |
+------+------+------+------+
|    3 |    3 |    1 |    1 |
|    2 |    2 |    1 |    1 |
|    1 |    1 |    1 |    1 |
|    3 |    3 |    4 |    4 |
|    2 |    2 |    4 |    4 |
|    1 |    1 |    4 |    4 |
|    3 |    3 |    3 |    3 |
|    2 |    2 |    3 |    3 |
|    1 |    1 |    3 |    3 |
+------+------+------+------+
9 rows in set (0.00 sec)
```

---

## 视图
同[oracle视图](#oracle视图)

## 触发器
同[oracle触发器](#oracle触发器)

不同之处:

- 设置值时需要使用`SET`指令
- `new`,`old`前不用加`:`

例子如下:
```sql
CREATE TRIGGER `created` 
BEFORE INSERT ON `videocardprice` 
FOR EACH ROW 
begin 
	if new.created is null then 
		set new.created = now();
	end if;
end
```


# oracle(windows 10)
## 安装启动
下载并安装，其中plsql或dbeaver选择一项即可。
- [oracle database](https://www.oracle.com/cn/downloads/#category-database) free!
- [pl/sql](https://www.allroundautomations.com/products/pl-sql-developer/) Nofree!
- [DBeaver](https://dbeaver.io/) free!

安装oracle datebase时可能会要求配置system账号的密码，此处使用`root`。

## 连接、退出
命令行：
安装完成后，从开始菜单中启动`运行sql命令行`，将会打开黑底白字命令行窗口。

```
SQL*Plus: Release 11.2.0.2.0 Production on 星期五 8月 6 09:59:47 2021

Copyright (c) 1982, 2014, Oracle.  All rights reserved.

SQL>
```

输入登录指令，输入密码(密码输入不会显示).

```
SQL> connect system;
输入口令:
已连接。
```

退出

```
SQL> exit;
```

DBeaver：
点击左上角`插头+`符号，选择oracle，输入用户名密码，选择正确的database，点击完成。

在左侧列表中选中服务器，点击上方SQL按钮，打开sql窗口，即可输入sql指令。

pl/sql：
选择左上方Connection子窗口中的设置按钮，选择new connection，输入用户名密码，选择正确的database，点击完成。

在左侧列表中选中服务器，右键打开sql窗口，即可输入sql指令。

## 表操作
### 创建
```sql
drop table test;
create table test (
       id int primary KEY,
       info varchar(20)
)
organization INDEX;

表已创建。
```

### 查看表结构
**注意：有些命令只能在comman窗口运行，此处会在命令前使用SQL>区别**

```
SQL> describe test;
 名称                                      是否为空? 类型
 ----------------------------------------- -------- ----------------------------
 ID                                        NOT NULL NUMBER(38)
 INFO                                               VARCHAR2(20)
```

### 更改、添加、删除列
```sql
alter table test modify (
    info varchar(10)
);

表已更改。

SQL> describe test;
 名称                                      是否为空? 类型
 ----------------------------------------- -------- ----------------------------
 ID                                        NOT NULL NUMBER(38)
 INFO                                               VARCHAR2(10)

alter table test add (
    inf varchar(10)
);

表已更改。

SQL> describe test;
 名称                                      是否为空? 类型
 ----------------------------------------- -------- ----------------------------
 ID                                        NOT NULL NUMBER(38)
 INFO                                               VARCHAR2(10)
 INF                                                VARCHAR2(10)

ALTER TABLE test DROP column info;

表已更改。

SQL> describe test;
 名称                                      是否为空? 类型
 ----------------------------------------- -------- ----------------------------
 ID                                        NOT NULL NUMBER(38)
 INF                                                VARCHAR2(10)
```

### 删除
```sql
DROP TABLE TEST;

表已删除。
```

## 基础操作
先创建表

```sql
drop table test;
create table test (
       id int primary KEY,
       info varchar(20)
)
organization INDEX;
```

### 单插入

```sql
insert into test (id, info) values (3, '3');

已创建 1 行。
```

### 多插入

```sql
INSERT INTO TEST (id, info) 
select 1, '1' from dual
union all select 2, '2' from dual;

已创建 2 行。
```

### 查询所有行

```sql
select * from test;

        ID INFO
---------- ----------------------------------------
         1 1
         2 2
         3 3
```

### 更新

```sql
update test set info = 'oooo' where id = 1;

已更新 1 行。
```

```sql
MERGE INTO target_table t
USING source_table s
ON (t.id = s.id)
WHEN MATCHED THEN
  UPDATE SET t.column1 = s.column1
  WHERE s.column1 is not null
WHEN NOT MATCHED THEN
  INSERT (t.id, t.column1)
  VALUES (s.id, s.column1)
  WHERE s.column1 is not null;
```

### 删除

```sql
delete test where id = 2;

已删除 1 行。
```

```sql
delete test;

已删除2行。
```

## 基础查询
先创建表，插入数据

```sql
drop table test;
create table test (
       id int,
       info varchar(20)
);
insert into test (id, info)
select 1, '1' from dual
union all select 1, '1' from dual
union all select 2, '2' from dual;
```

### 查询字段
**注意：查询其他用户需在表名前加`用户名.`限定**
```sql
select id from test;

        ID
----------
         1
         1
         2
```

### 常量、函数、表达式查询
```sql
select 123,'aasd','1'||'a',1+1,1+'1',1,1+null from dual;

       123 'AASD'   '1'|        1+1      1+'1'          1     1+NULL
---------- -------- ---- ---------- ---------- ---------- ----------
       123 aasd     1a            2          2          1
```

### 别名
```sql
select id as oo, info pp from test;

        OO PP
---------- ----------------------------------------
         1 1
         1 1
         2 2
```

### 查询结果去重
```sql
select distinct id as oo, info pp from test;

        OO PP
---------- ----------------------------------------
         2 2
         1 1
```

### 多行聚合
```sql
SELECT id, listagg(val, ',') within group(ORDER BY id) AS val 
FROM (
     select 1 as id, 't' as val from dual
     union select 1, 'q' from dual
)
GROUP BY id
```

## 条件、模糊查询
先创建表，插入数据

```sql
drop table test;
create table test (
       id int,
       info varchar(20)
);
insert into test (id, info)
select 1, '1' from dual
union all select 1, '332' from dual
union all select 2, '443' from dual
union all select 3, '4443' from dual
union all select 2, '2524' from dual;
```

```sql
select * from test where id > 1 or info like '2_2%';

        ID INFO
---------- ----------------------------------------
         2 443
         3 4443
         2 2524
```

```sql
select * from test where info <> '1' and id between 2 and 3;

        ID INFO
---------- ----------------------------------------
         2 443
         3 4443
         2 2524
```

```sql
select * from test where id in(1,2) and info in('1','332');

        ID INFO
---------- ----------------------------------------
         1 1
         1 332
```

## 排序查询
先创建表，插入数据

```sql
drop table test;
create table test (
       id int,
       info varchar(20)
);
insert into test (id, info)
select 1, '1' from dual
union all select 1, '3' from dual
union all select 2, '3' from dual
union all select 2, '2' from dual;
```

```sql
select * from test order by info, id;

        ID INFO
---------- ----------------------------------------
         1 1
         2 2
         1 3
         2 3
```

关于null的处理

- `nulls first`: 将null放在最前
- `nulls last`: 将null放在最后

在排序中也可使用`nvl()`等函数来实现多行排序

## 分组查询
先创建表，插入数据

```sql
drop table test;
create table test (
       id int,
       info varchar(20)
);
insert into test (id, info)
select 1, '1' from dual
union all select 1, '3' from dual
union all select 2, '3' from dual
union all select 2, '2' from dual;
```

```sql
select id, max(length(info)) from test group by id having id = 1;

        ID MAX(LENGTH(INFO))
---------- -----------------
         1                 1
         2                 1
```

## 连接查询
先创建表，插入数据

```sql
drop table test;
create table test (
       id int,
       pid int,
       info varchar(20)
);
insert into test (id, pid, info)
select 1, 0, '1' from dual
union all select 2, 1, '2' from dual
union all select 3, 2, '3' from dual
union all select 4, 3, '4' from dual;
select * from test;

        ID        PID INFO
---------- ---------- ----------------------------------------
         1          0 1
         2          1 2
         3          2 3
         4          3 4
```

### 自连接
```sql
select t1.id, t2.pid, t1.info from test t1
inner join test t2 on t1.id = t2.pid;

        ID        PID INFO
---------- ---------- ----------------------------------------
         1          1 1
         2          2 2
         3          3 3
```

### 左、右连接
```sql
column info format a10;
select * from test t1
left outer join test t2 on t1.id = t2.pid;

        ID        PID INFO               ID        PID INFO
---------- ---------- ---------- ---------- ---------- ----------
         1          0 1                   2          1 2
         2          1 2                   3          2 3
         3          2 3                   4          3 4
         4          3 4
```


```sql
column info format a10;
select * from test t1
right outer join test t2 on t1.id = t2.pid;

        ID        PID INFO               ID        PID INFO
---------- ---------- ---------- ---------- ---------- ----------
         1          0 1                   2          1 2
         2          1 2                   3          2 3
         3          2 3                   4          3 4
                                          1          0 1
```

### 内、全外连接
先创建表，插入数据

```sql
drop table test;
create table test (
       id int,
       info varchar(20)
);
insert into test (id, info)
select 1, '1' from dual
union all select 2, '2' from dual
union all select 3, '3' from dual
union all select 4, '4' from dual;

drop table test2;
create table test2 (
       id2 int,
       info2 varchar(20)
);
insert into test2 (id2, info2)
select 2, '2' from dual
union all select 3, '3' from dual
union all select 4, '4' from dual
union all select 5, '5' from dual;
select * from test;
select * from test2;

        ID INFO
---------- ----------
         1 1
         2 2
         3 3
         4 4

       ID2 INFO2
---------- ----------------------------------------
         2 2
         3 3
         4 4
         5 5
```

```sql
column info format a10;
column info2 format a10;
select * from test t
inner join test2 t2 on t.id = t2.id2;

        ID INFO              ID2 INFO2
---------- ---------- ---------- ----------
         2 2                   2 2
         3 3                   3 3
         4 4                   4 4
```

```sql
column info format a10;
column info2 format a10;
select * from test t
full outer join test2 t2 on t.id = t2.id2;

        ID INFO              ID2 INFO2
---------- ---------- ---------- ----------
         2 2                   2 2
         3 3                   3 3
         4 4                   4 4
                               5 5
         1 1
```

### 交叉连接
```sql
column info format a2;
column id format 9;
column info2 format a2;
column id2 format 9;
select * from test
cross join test2;


        ID INFO              ID2 INFO2
---------- ---------- ---------- ----------
         1 1                   2 2
         1 1                   3 3
         1 1                   4 4
         1 1                   5 5
         2 2                   2 2
         2 2                   3 3
         2 2                   4 4
         2 2                   5 5
         3 3                   2 2
         3 3                   3 3
         3 3                   4 4

        ID INFO              ID2 INFO2
---------- ---------- ---------- ----------
         3 3                   5 5
         4 4                   2 2
         4 4                   3 3
         4 4                   4 4
         4 4                   5 5

已选择16行。
```

## oracle视图
先创建表，插入数据

```sql
drop table test;
create table test (
       id int,
       info varchar(20)
);
insert into test (id, info)
select 1, '1' from dual
union all select 1, '2' from dual
union all select 3, '3' from dual
union all select 4, '4' from dual;
select * from test;

ID INFO
-- ----
 1 1
 1 2
 3 3
 4 4
```

```sql
create or replace view id_1 as select info from test where id = 1;

视图已创建。
```

```sql
select * from id_1;

INFO
----
1
2
```

```sql
insert into id_1 (info) values ('ppp');

已创建 1 行。

select * from id_1;

INFO
----------------------------------------
1
2

select * from test;

        ID INFO
---------- ----------------------------------------
         1 1
         1 2
         3 3
         4 4
           ppp
```

```sql
drop view id_1;

视图已删除。
```



## oracle触发器
先创建表，插入数据

```sql
drop table test;
create table test (
       id int,
       create_date date
);
```

### 行级触发
**注意：在命令行运行块命令时，需要换行并加上`/`后回车才能执行**

```sql
create trigger auto_date
before insert on test
for each row
begin
    if :new.create_date is null then
        :new.create_date := sysdate;
    end if;
end;
/

触发器已创建
```

`before insert`: 插入之前

`after insert`: 插入之后

还有`update`，`delete`等

带有`for each row`的指行触发器，支持`new`和`old`表示新值与原值。

```sql
insert into test (id) values (1);

已创建 1 行。

select * from test;

        ID CREATE_DATE
---------- --------------
         1 06-8月 -21
```

```sql
drop trigger auto_date;

触发器已删除。
```

```sql
insert into test (id) values (1);

已创建 1 行。

select * from test;

        ID CREATE_DATE
---------- --------------
         1 06-8月 -21
         2
```

### 表级触发
```sql
create trigger auto_del
before insert on test
begin
    delete test;
end;
/

触发器已创建
```

```sql
select * from test;

        ID CREATE_DATE
---------- --------------
         1 06-8月 -21
         2

insert into test (id) values (3);

已创建 1 行。

select * from test;

        ID CREATE_DATE
---------- --------------
         3
```

```sql
drop trigger auto_del;

触发器已删除。
```

### 声明、自定义警告
先创建表，插入数据

```sql
drop table test;
create table test (
       id int,
       info varchar(20)
);
```

```sql
create trigger info_empty
before insert on test
for each row
declare
    infoEmptyErr exception;
begin
    if :new.info is null then
        raise infoEmptyErr;
    end if;
exception
    when infoEmptyErr then
        raise_application_error(-20001, '错误');
end;
/

触发器已创建
```

```sql
insert into test (id) values (3);

insert into test (id) values (3)
            *
第 1 行出现错误:
ORA-20001: 错误
ORA-06512: 在 "SYSTEM.INFO_EMPTY", line 9
ORA-04088: 触发器 'SYSTEM.INFO_EMPTY' 执行过程中出错
```

```sql
drop trigger info_empty;

触发器已删除。
```

## 过程、方法、包
这里仅介绍包的相关内容，过程、方法可以在包中创建，单独创建的语法也类似。

过程、方法中均不能出现简单select语句，需要配合游标使用或使用select into。

方法必须至少有一个返回值。

在方法、包中，不区分is as。

先创建包头，再创建包体，否则会`警告: 创建的包体带有编译错误。`。

```sql
CREATE OR REPLACE PACKAGE testPackage
AS
    function testF (id IN int) return int;
    procedure testP;
    procedure testP2;
    procedure testP3;
END testPackage;
/

程序包已创建。

CREATE OR REPLACE PACKAGE BODY testPackage AS
    function testF (id IN int)
        return int
    AS
    BEGIN
        INSERT INTO test (id) VALUES (id);
        return(0);
    END testF;

    procedure testP AS
        c NUMBER;
        CURSOR cur IS SELECT count(*) FROM test;
    BEGIN
        c := 0;
        OPEN cur;
        loop
            FETCH cur INTO c;
            EXIT WHEN cur%notfound;
            dbms_output.put_line(c);
        END LOOP;
        CLOSE cur;
    END testP;

    procedure testP2 AS
        c NUMBER;
    BEGIN
        SELECT count(*) into c FROM test;
        testP();
        dbms_output.put_line(c);
    END testP2;

    procedure testP3 AS
    BEGIN
        execute immediate 'delete test';
    END testP3;
END testPackage;
/

程序包体已创建。
```

```sql
execute dbms_output.put_line(testPackage.testf(8));
0

PL/SQL 过程已成功完成。

execute testPackage.testp2();
4
4

PL/SQL 过程已成功完成。
```

当先包体对应包头时，删除包头会一起删除包体。

```sql
DROP PACKAGE testPackage;

程序包已删除。

DROP PACKAGE body testPackage;

程序包体已删除。
```

## pl/sql
先创建表，插入数据

```sql
drop table test;
create table test (
       rad int,
       area number(14,4)
);
insert into test (rad)
select 1 from dual
union all select 2 from dual
union all select 3 from dual
union all select 4 from dual;
select * from test;

       RAD       AREA
---------- ----------
         1
         2
         3
         4
```

### 游标
```sql
declare
    pi constant number(9,7) := 3.1415927;
    cursor rad_cursor is 
        select * from test where area is null;
    rad_val rad_cursor%rowtype;
begin
    open rad_cursor;
    loop
        exit when rad_cursor%notfound;
        fetch rad_cursor into rad_val;
        update test set area = pi*power(rad_val.rad, 2) where rad = rad_val.rad;
    end loop;
    close rad_cursor;
end;
/

PL/SQL 过程已成功完成。

select * from test;

       RAD       AREA
---------- ----------
         1     3.1416
         2    12.5664
         3    28.2743
         4    50.2655
```

### 循环
```sql
declare
    i int;
begin
    i := 5;
    while i < 10 loop
        insert into test (rad) values (i);
        i := i + 1;
    end loop;
end;
/

PL/SQL 过程已成功完成。

select * from test;

       RAD       AREA
---------- ----------
         1     3.1416
         2    12.5664
         3    28.2743
         4    50.2655
         5
         6
         7
         8
         9

已选择9行。
```

```sql
begin
    for i in 10..14 loop
        insert into test (rad) values (i);
    end loop;
end;
/

PL/SQL 过程已成功完成。

select * from test;

       RAD       AREA
---------- ----------
         1     3.1416
         2    12.5664
         3    28.2743
         4    50.2655
         5
         6
         7
         8
         9
        10
        11

       RAD       AREA
---------- ----------
        12
        13
        14
```

### 条件
**注意：这个功能在语句块里都支持**

语法：

```
if xxx then
    xxx;
else if xxx then
    xxx;
else
    xxx;
end if;
```

```sql
begin
    for i in 1..10 loop
        if mod(i, 2) = 0 then
            update test set area = 0 where rad = i;
        end if;
    end loop;
end;
/

PL/SQL 过程已成功完成。

select * from test;

       RAD       AREA
---------- ----------
         1     3.1416
         2          0
         3    28.2743
         4          0
         5
         6          0
         7
         8          0
         9
        10          0
        11

       RAD       AREA
---------- ----------
        12
        13
        14

已选择14行。
```

## 用户、密码管理、角色、权限
### 用户
```sql
CREATE USER testUser IDENTIFIED BY password;

用户已创建。

ALTER USER testUser IDENTIFIED BY 12345;

用户已更改。

DROP USER testUser;

用户已删除。
```

### 密码管理
先创建用户
```sql
CREATE USER testUser IDENTIFIED BY password;

用户已创建。
```

#### 创建
```sql
CREATE profile testProfile LIMIT
password_life_time 30
Failed_login_attempts 3
password_reuse_max 3;

配置文件已创建
```

`password_life_time`：密码有效天数

`Failed_login_attempts`：最大失败次数

`password_reuse_max`：禁止密码重用记录数

#### 配置到用户、取消
```sql
alter user testUser profile testProfile;

用户已更改。

alter user testUser profile default;

用户已更改。
```

#### 人工操作
```sql
ALTER USER testUser account lock;

用户已更改。

ALTER USER testUser account unlock;

用户已更改。

ALTER USER testUser password expire;

用户已更改。
```

#### 删除
```sql
DROP profile testProfile;

配置文件已删除。
```

### 角色
```sql
CREATE ROLE testRole;

角色已创建。

GRANT testRole TO testUser;

授权成功。

REVOKE testRole from testUser;

撤销成功。

DROP ROLE testRole;

角色已删除。
```

### 权限
**权限同样可以赋予角色**
```sql
GRANT CREATE SESSION TO testUser;
REVOKE CREATE SESSION FROM testUser;

GRANT CREATE TABLE TO testUser;
REVOKE CREATE TABLE FROM testUser;

GRANT SELECT ON test TO testUser;
GRANT INSERT ON test TO testUser;
GRANT DELETE ON test TO testUser;
REVOKE ALL ON test FROM testUser;
```

`SESSION`权限影响登录。

## 对象、对象视图
### 对象
先drop掉一些元素
```sql
drop table test;
```

```sql
CREATE TYPE testObject AS OBJECT (
	id int,
	id2 int
);
/

类型已创建。

CREATE TABLE test (id testObject);

表已创建。

INSERT INTO test (id) VALUES (testObject(0, 1));

已创建 1 行。

SELECT * FROM test;

ID(ID, ID2)
--------------------------------------------------------------------------------
TESTOBJECT(0, 1)
```

当其他用户要创建基于此对象的对象或表时，需要授权。

例：

```sql
GRANT EXECUTE ON testObject TO testUser;
```

取消授权语法同上文中权限一章。

### 对象视图
对于已经创建好的表，可以使用对象视图的功能达到对象的功能。

先创建表，插入数据

```sql
drop table test;
create table test (
       rad int,
       area int
);
insert into test (rad)
select 1 from dual
union all select 2 from dual
union all select 3 from dual
union all select 4 from dual;
select * from test;

       RAD       AREA
---------- ----------
         1
         2
         3
         4
```

使用上文`对象`中的对象。

```sql
create view testOV (id) as
select testObject(rad, area) from test;

视图已创建。

select * from testOV;

ID(ID, ID2)
--------------------------------------------------------------------------------
TESTOBJECT(1, NULL)
TESTOBJECT(2, NULL)
TESTOBJECT(3, NULL)
TESTOBJECT(4, NULL)
```

对象视图插入等功能同视图。

## 索引
### 普通、唯一、主键索引
先创建表，插入数据

```sql
drop table test;
create table test (
       rad int,
       area number(14,4)
);
insert into test (rad)
select 1 from dual
union all select 2 from dual
union all select 3 from dual
union all select 4 from dual;
select * from test;

       RAD       AREA
---------- ----------
         1
         2
         3
         4
```

```sql
create unique index index_rad on test(rad);

索引已创建。

drop index index_rad;

索引已删除。
```

```sql
alter table test add primary key (rad);

表已更改。

SQL> describe test;

 名称                                      是否为空? 类型
 ----------------------------------------- -------- ----------------------------
 RAD                                       NOT NULL NUMBER(38)
 AREA                                               NUMBER(14,4)

alter table test drop primary key;

表已更改。
```

索引B+树中，主键索引存放整行数据，非主键索引存放主键的值，因此在查找非主键索引时需要再次回表查询主键。

对于自增主键，将会避免B+分裂，插入更有效率。

### 全文索引
先创建表，插入数据

```sql
drop table test;
create table test (
       rad varchar(10),
       area number(14,4)
);
insert into test (rad)
select '1' from dual
union all select '2' from dual
union all select '3' from dual
union all select '4' from dual;
select * from test;

RAD                        AREA
-------------------- ----------
1
2
3
4
```

文本解析器、全文索引的启动、同步、删除。

```sql
execute ctx_ddl.create_preference ('my_lexer', 'chinese_vgram_lexer');

PL/SQL 过程已成功完成。

create index index_rad on test(rad) indextype is ctxsys.context parameters('lexer my_lexer');

索引已创建。

exec ctx_ddl.sync_index('index_rad'); 

PL/SQL 过程已成功完成。

alter index index_rad rebuild;

索引已更改。

drop index index_rad;

索引已删除。

execute ctx_ddl.drop_preference ('my_lexer');

PL/SQL 过程已成功完成。
```

自然语言的分析器

- basic_lexer 英语
- chinese_vgram_lexer 汉语gbk
- chinese_lexer 新汉语utf-8


## 外键
先创建表，插入数据

```sql
drop table test;
create table test (
       rad int primary key,
       area number(14,4)
);
insert into test (rad)
select 1 from dual
union all select 2 from dual
union all select 3 from dual
union all select 4 from dual;
select * from test;

       RAD       AREA
---------- ----------
         1
         2
         3
         4
```

```sql
drop table test2;
create table test2 (
       rad int,
       area2 number(14,4),
       constraint radlink foreign key (rad) references test (rad)
);

表已创建。

insert into test2 (rad) values (1);

已创建 1 行。

insert into test2 (rad) values (9);
insert into test2 (rad) values (9)
*
第 1 行出现错误:
ORA-02291: 违反完整约束条件 (SYSTEM.RADLINK) - 未找到父项关键字
```

## 序列
新建序列
```sql
create sequence test_seq
increment by 1
start with 1
minvalue 1
maxvalue 9999999
order
cycle;

Sequence created

```

`increment by`：自增值

`start with`：初始值

`order`: 生成的值是按顺序的

`cycle`：到达最大后循环

获取下一值（序列自动加1），获取当前值
```sql
select test_seq.nextval,test_seq.currval from dual;

   NEXTVAL    CURRVAL
---------- ----------
         1          1
```

将序列设置为指定值
```sql
alter sequence seq_name increment by 5655;
select seq_name.nextval from dual;
alter sequence seq_name increment by 1;
```

删除序列
```sql
drop sequence test_seq;

Sequence dropped
```

## 常用
### regex
#### REGEXP_LIKE
```sql
REGEXP_LIKE( <subject> , <pattern> [ , <parameters> ] )
```
parameters
```
c Case-sensitive matching (default)

i Case-insensitive matching

m Multi-line mode

e Extract submatches

s POSIX wildcard character . matches \n
```

#### REGEXP_REPLACE
```sql
REGEXP_REPLACE( <subject> , <pattern> [ , <replacement> , <position> , <occurrence> , <parameters> ] )
```
position
```
Number of characters from the beginning of the string where the function starts searching for matches.

Default: 1 (the search for a match starts at the first character on the left)
```
occurrence
```
Specifies which occurrence of the pattern to replace. If 0 is specified, all occurrences are replaced.

Default: 0 (all occurrences)
```

#### REGEXP_SUBSTR
```sql
REGEXP_SUBSTR( <subject> , <pattern> [ , <position> [ , <occurrence> [ , <regex_parameters> [ , <group_num> ] ] ] ] )
```

### case when
```sql
select
   case 1
     when 1 then 1 
     else 2
   end as val
from dual;

       VAL
----------
         1
```

### decode
```sql
select
   decode(1,1,'is 1',2,'is 2','default')
from dual;

DECODE(1,1,'IS1',2,'IS2','DEFAULT')
-----------------------------------
is 1
```

### 一条sql统计多个总和
```
count(decode(status,'Y',1,NULL)) AS Y数量,
count(decode(status,'N',1,NULL)) AS N数量
```

### left join 只需要特定一条
找同`username`中的最大`uid`那一条。

```sql
left join (SELECT * FROM user WHERE uid in (SELECT MAX(uid) FROM user group by username)) t 
on t.username = ?
```

### 根据结果修改表
```
UPDATE {表1} t SET t.a = (
	select 
	from
	left
	where 
    AND t.ID = {表1}.唯一id
)
WHERE t.ID IN (
	select {表1}.唯一id
	from
	left join
	where
)
```

### 日期
#### 一天后
```sql
select sysdate+1 from dual
```

#### 获取当前星期第一日
```sql
select trunc(sysdate, 'd') from dual
```

#### 获取当前月第一日
```sql
select trunc(sysdate, 'mm') from dual
```

#### 获取上下月第一日
```sql
select add_months(trunc(sysdate, 'mm'), -1) from dual

select add_months(trunc(sysdate, 'mm'), 1) from dual
```

#### 获取当前年第一日
```sql
select trunc(sysdate, 'yy') from dual
```
#### 日期格式化
```sql
select to_char(sysdate, 'yyyy-mm-dd hh24:mi:ss') from dual;

select to_date('2022-07-12 08:37:31', 'yyyy-mm-dd hh24:mi:ss') from dual;
```

### 根据某列找出行
```sql
select * from (
  select t.*, row_number() over(order by nvl(updated,created) desc) as c
  from test t
  where t.updated > to_date('2022-01-01','yyyy-mm-dd')
) t1 where t1.c = 1
```