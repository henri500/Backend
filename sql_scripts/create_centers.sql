CREATE TABLE centers(
    ID INT  NOT NULL AUTO_INCREMENT,
    centerName VARCHAR(264),
    centerAddress VARCHAR(264),
    centerPostode VARCHAR(10),
    PRIMARY key (ID),
    FOREIGN KEY (centerID) REFERENCES users(ID)
);