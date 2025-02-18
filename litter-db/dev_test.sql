-- devユーザ用のテスト
create database test; --データベースが作れないことの確認

-- テーブルが作れることの確認
use litter;
create table test (
    id serial primary key,
    name text not null
    );

--insertが出来ることの確認
insert into test (name) values ('dev_test1');
insert into test (name) values ('dev_test2');
show tables;

--selectが出来ることの確認
select * from test;
show tables;

--updateが出来ることの確認
update test set name = 'success' where id = 1;
show tables;

--alterが出来ることの確認
alter table test add column count int;
show tables;

--deleteが出来ることの確認
delete from test where id = 2;
show tables;
