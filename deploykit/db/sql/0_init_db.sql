
-- ユーザの作成 ※パスワード設定は必要に応じてこの処理のあとに変更する。
SET GLOBAL validate_password_policy = 'LOW';
ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
CREATE USER 'api'@'localhost' IDENTIFIED BY 'password';
CREATE USER 'dev'@'localhost' IDENTIFIED BY 'password';
CREATE USER 'api'@'172.%' IDENTIFIED BY 'password';
CREATE USER 'dev'@'172.%' IDENTIFIED BY 'password';

-- 権限の付与
GRANT SELECT,INSERT,UPDATE ON litter.* TO 'api'@'localhost';
GRANT SELECT,INSERT,UPDATE ON litter.* TO 'api'@'172.%';
GRANT SELECT,INSERT,UPDATE,DELETE,ALTER,CREATE ON litter.* TO 'dev'@'localhost';
GRANT SELECT,INSERT,UPDATE,DELETE,ALTER,CREATE ON litter.* TO 'dev'@'172.%';

FLUSH PRIVILEGES;
