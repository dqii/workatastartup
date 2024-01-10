SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: lantern; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS lantern WITH SCHEMA public;


--
-- Name: EXTENSION lantern; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION lantern IS 'LanternDB: Fast vector embedding processing in Postgres';


--
-- Name: lantern_cli; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA lantern_cli;


--
-- Name: lantern_extras; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS lantern_extras WITH SCHEMA public;


--
-- Name: EXTENSION lantern_extras; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION lantern_extras IS 'lantern_extras:  Convenience functions for working with vector embeddings';


--
-- Name: notify_insert_lantern_daemon_14(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_insert_lantern_daemon_14() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
              BEGIN
                PERFORM pg_notify('lantern_client_notifications_14', NEW.id::TEXT || ':' || '14');
                RETURN NULL;
              END;
            $$;


--
-- Name: notify_insert_lantern_daemon_6(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_insert_lantern_daemon_6() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
              BEGIN
                PERFORM pg_notify('lantern_client_notifications_6', NEW.id::TEXT || ':' || '6');
                RETURN NULL;
              END;
            $$;


--
-- Name: notify_insert_lantern_daemon_employees_first_name_first_name_em(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_insert_lantern_daemon_employees_first_name_first_name_em() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
              BEGIN
                PERFORM pg_notify('lantern_client_notifications_employees_first_name_first_name_embedding', NEW.id::TEXT || ':' || '2');
                RETURN NULL;
              END;
            $$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id text NOT NULL,
    title text,
    date timestamp(3) without time zone,
    url text,
    company_name text,
    city text,
    state text,
    country text,
    description text,
    type text,
    workplace text,
    salary_low integer,
    salary_high integer,
    salary_low_currency text,
    salary_high_currency text,
    company_id integer,
    description_embedding real[],
    description_embedding_v2 real[],
    description_tsvector tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, COALESCE(description, ''::text))) STORED
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(128) NOT NULL
);


--
-- Name: jobs Job_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT "Job_pkey" PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: jobs_description_embedding_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_description_embedding_idx ON public.jobs USING hnsw (description_embedding public.dist_cos_ops) WITH (ef_construction='128', ef='64', m='10', dim='1024');


--
-- Name: jobs_description_embedding_v2_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_description_embedding_v2_idx ON public.jobs USING hnsw (description_embedding_v2 public.dist_cos_ops) WITH (ef_construction='128', ef='64', m='10', dim='384');


--
-- Name: jobs_description_tsvector_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_description_tsvector_idx ON public.jobs USING gin (description_tsvector);


--
-- Name: jobs trigger_lantern_jobs_insert_14; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_lantern_jobs_insert_14 AFTER INSERT ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.notify_insert_lantern_daemon_14();


--
-- Name: jobs trigger_lantern_jobs_insert_6; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_lantern_jobs_insert_6 AFTER INSERT ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.notify_insert_lantern_daemon_6();


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20240110042509'),
    ('20240110042812');
