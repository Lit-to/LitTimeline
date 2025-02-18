
--insertが出来ることの確認
insert into test (name) values ('api_test1');
insert into test (name) values ('api_test2');
show tables;

--selectが出来ることの確認
select * from test;
show tables;

--updateが出来ることの確認
update test set name = 'success' where id = 1;
show tables;

