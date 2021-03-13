CREATE TABLE codes (
    ID INT NOT NULL AUTO_INCREMENT,
    code VARCHAR(16) UNIQUE NOT NULL,
    centerAssigned INT NOT NULL,
    PRIMARY key (ID),
    FOREIGN KEY (centerAssigned) REFERENCES centers(ID)
);