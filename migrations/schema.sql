create table if not exists account (
    id serial primary key,
    username varchar not null unique,
    role varchar not null default 'user',
    password_hash varchar not null,
    display_name varchar not null
);

create table if not exists model_provider (
    id varchar primary key,
    type varchar not null,
    display_name varchar,
    data jsonb
);

create table if not exists model (
    id varchar primary key,
    provider_id varchar not null references model_provider(id)
        on update cascade
        on delete cascade,
    kind varchar not null,
    display_name varchar not null,
    data jsonb
);

create table if not exists conversation (
    id uuid primary key,
    account_id bigint not null references account(id),
    title varchar,
    model_id varchar references model(id),
    started_at timestamp not null default current_timestamp
);

create table if not exists message (
    conversation_id uuid not null references conversation(id)
        on delete cascade,
    id bigint not null,
    role varchar not null,
    body text not null,
    posted_at timestamp not null default current_timestamp,
    primary key (conversation_id, id)
);

create table if not exists setting (
    name varchar primary key,
    value jsonb
);
