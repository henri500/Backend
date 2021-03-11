CREATE DATABASE IF NOT EXISTS DB_project;

CREATE TABLE centers(
    ID INT  NOT NULL AUTO_INCREMENT,
    centerName VARCHAR(264) ,
    centerAddress VARCHAR(264) NOT NULL ,
    centerPostcode VARCHAR(10) NOT NULL ,
    PRIMARY key (ID)
);
INSERT INTO centers (centerName,centerAddress,centerPostcode) VALUES 
('center1','address center1','BPPBEY'),
('center2','address center2','BAPBEY'),
('center3','address center3','CVVVV23');
CREATE TABLE roles(
    roleName VARCHAR(16),
    description TEXT,
 
    PRIMARY key (roleName)
);
INSERT INTO roles (rolename) VALUES ('public');
INSERT INTO roles (rolename) VALUES ('admin');
INSERT INTO roles (rolename) VALUES ('worker');

CREATE TABLE users (
    ID INT NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(32),
    lastName VARCHAR(32),
    username VARCHAR(16) UNIQUE NOT NULL,
    about TEXT,
    dateRegistered DATETIME DEFAULT CURRENT_TIMESTAMP,
    passwordHash VARCHAR(2048) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    avatarURL VARCHAR(64),
    roleID VARCHAR(16) DEFAULT 'public' ,
    centerID INT,
    PRIMARY KEY (ID),
    FOREIGN KEY (centerID) REFERENCES centers(ID),
    FOREIGN KEY (roleID) REFERENCES roles (roleName)
);

CREATE TABLE breeds(
    breedName VARCHAR(32) UNIQUE NOT NULL,
    description TEXT,
    PRIMARY key (breedName)
);

CREATE TABLE dog(
    ID INT  NOT NULL AUTO_INCREMENT,
    breedName  VARCHAR(32),
    dogName  VARCHAR(64),
    centerID INT NOT NULL ,
    FOREIGN KEY (breedName) REFERENCES breeds(breedName),
    FOREIGN KEY (centerID) REFERENCES centers(ID) ON DELETE CASCADE,
    PRIMARY key (ID)
);



CREATE TABLE listings (
    ID INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(32) NOT NULL,
    descriptionText TEXT NOT NULL,
    dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    dateModified DATETIME ON UPDATE CURRENT_TIMESTAMP,
    listingAvarta VARCHAR(2048),
    published BOOL,
    breedName VARCHAR(32),
    dogID INT NOT NULL,
    authorID INT NOT NULL,
    centerID INT NOT NULL,
    FOREIGN KEY (breedName) REFERENCES breeds(breedName),
    FOREIGN KEY (dogID) REFERENCES dogs(ID),
    FOREIGN KEY (centerID) REFERENCES centers(ID),
    FOREIGN KEY (authorID) REFERENCES users(ID),
    PRIMARY KEY (ID)
);