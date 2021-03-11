CREATE TABLE codes (
    ID INT NOT NULL,
    code VARCHAR(16) UNIQUE NOT NULL,
    centerAssigned INT NOT NULL,
    FOREIGN KEY (centerAssigned) REFERENCES centers(ID),
);