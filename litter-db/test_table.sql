
use litter;
create table test (
    id serial primary key,
    name text not null
    );
insert into test (name) values ('test1');
insert into test (name) values ('test2');
select * from test;
show tables;
drop table test;

