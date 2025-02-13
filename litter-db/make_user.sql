
set global validate_password.policy=LOW;
alter user 'root'@'localhost' identified by 'password';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

