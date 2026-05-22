-- Slice of Life Archive — Snowflake DDL
--
-- Run as ACCOUNTADMIN once. After this, Fivetran lands into bronze_*,
-- dbt builds silver + gold, Cortex Analyst sits on gold.

create warehouse if not exists slice_of_life_wh
    warehouse_size = 'x-small'
    auto_suspend = 60
    auto_resume = true
    initially_suspended = true;

create database if not exists slice_of_life;
use database slice_of_life;

create schema if not exists bronze_fandom;
create schema if not exists bronze_tmdb;
create schema if not exists bronze_wikidata;
create schema if not exists silver;
create schema if not exists gold;

-- Fivetran-managed Iceberg external volume (points at the S3 + Glue lake)
create external volume if not exists slice_of_life_lake
    storage_locations = (
        (
            name = 's3-lake'
            storage_provider = 's3'
            storage_base_url = 's3://slice-of-life-odi-lake/'
            storage_aws_role_arn = 'arn:aws:iam::<account>:role/slice-of-life-snowflake-iceberg'
            storage_aws_external_id = '<random>'
        )
    )
    allow_writes = false;

-- Fivetran writer role
create role if not exists fivetran_writer;
grant usage on warehouse slice_of_life_wh to role fivetran_writer;
grant usage on database slice_of_life to role fivetran_writer;
grant usage on schema slice_of_life.bronze_fandom   to role fivetran_writer;
grant usage on schema slice_of_life.bronze_tmdb     to role fivetran_writer;
grant usage on schema slice_of_life.bronze_wikidata to role fivetran_writer;
grant create table, modify on schema slice_of_life.bronze_fandom   to role fivetran_writer;
grant create table, modify on schema slice_of_life.bronze_tmdb     to role fivetran_writer;
grant create table, modify on schema slice_of_life.bronze_wikidata to role fivetran_writer;

-- dbt role
create role if not exists dbt_runner;
grant usage on warehouse slice_of_life_wh to role dbt_runner;
grant usage on database slice_of_life to role dbt_runner;
grant usage on all schemas in database slice_of_life to role dbt_runner;
grant select on all tables in database slice_of_life to role dbt_runner;
grant create table, create view, create dynamic table on schema slice_of_life.silver to role dbt_runner;
grant create table, create view, create dynamic table on schema slice_of_life.gold   to role dbt_runner;
grant modify on schema slice_of_life.silver to role dbt_runner;
grant modify on schema slice_of_life.gold   to role dbt_runner;

-- Cortex Analyst role (read-only on gold)
create role if not exists cortex_reader;
grant usage on warehouse slice_of_life_wh to role cortex_reader;
grant usage on database slice_of_life to role cortex_reader;
grant usage on schema slice_of_life.gold to role cortex_reader;
grant select on all tables in schema slice_of_life.gold to role cortex_reader;
grant select on future tables in schema slice_of_life.gold to role cortex_reader;
