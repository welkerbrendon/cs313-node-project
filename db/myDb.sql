CREATE TABLE user_info (
    id UUID NOT NULL PRIMARY KEY,
    username VARCHAR(225) NOT NULL UNIQUE,
    account_password VARCHAR(225) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    last_active TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE day (
    id VARCHAR(47) PRIMARY KEY,
    given_day DATE NOT NULL,
    user_id UUID NOT NULL REFERENCES user_info(id),
    journal TEXT,
    last_updated TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE activity (
    id UUID NOT NULL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES user_info(id),
    day_id VARCHAR(47) NOT NULL REFERENCES day(id),
    activity_type_id INT NOT NULL REFERENCES activity_type(id),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    productive BOOLEAN NOT NULL,
    notes TEXT,
    last_updated TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE activity_type (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES user_info(id),
    type_name VARCHAR(40) NOT NULL,
    universal BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE journal_entry (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES user_info(id),
    day_id VARCHAR(47) NOT NULL REFERENCES day(id),
    entry TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    last_updated TIMESTAMP NOT NULL
);