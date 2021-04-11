CREATE TABLE centers(
    ID INT  NOT NULL AUTO_INCREMENT,
    centerName VARCHAR(264) NOT NULL,
    centerAddress VARCHAR(264) UNIQUE NOT NULL,
    centerPostode VARCHAR(10) NOT NULL,
    PRIMARY key (ID),
    FOREIGN KEY (centerID) REFERENCES users(ID)
);
INSERT INTO centers (centerName,centerAddress,centerPostcode) VALUES 
('center1','address center1','BPPBEY'),
('center2','address center2','BAPBEY'),
('center3','address center3','CVVVV23');