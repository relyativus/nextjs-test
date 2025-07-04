SET GLOBAL local_infile=1;

create table users (
  id bigint NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name text NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at DATE NOT NULL
);