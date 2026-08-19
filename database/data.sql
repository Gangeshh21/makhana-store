--
-- PostgreSQL database dump
--

\restrict Raa0fiv5SxZshmDVfvLV6ftrcYxPhe3dgLeHTp1FbVHGu1h2wLIqlZKJD8ANCDs

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, name, description, price, weight, stock, created_at) FROM stdin;
4	Cheese Makhana	Crunchy makhana with cheesy seasoning.	379.00	250g	35	2026-08-19 14:48:02.772
1	Classic Makhana	Lightly roasted premium fox nuts.	299.00	250g	48	2026-08-19 14:48:02.772
3	Pudina Makhana	Refreshing mint flavoured roasted makhana.	329.00	250g	44	2026-08-19 14:48:02.772
2	Peri Peri Makhana	Crispy makhana with a spicy peri peri flavour.	349.00	250g	36	2026-08-19 14:48:02.772
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password_hash, created_at, role) FROM stdin;
1	Test User	test@example.com	$2b$10$nhbg2U6h8xm69gYvp3ojDulT0NPrPy48wSKtB/hOhKlI5kH8WHOUC	2026-08-19 14:59:06.515925	user
2	gangesh	gangeshjaes53@gmail.com	$2b$10$8aXMC15pzNKLUpGXHYwuvOEIAwszwBldw0u74wgbykxF52aponOU2	2026-08-19 15:18:18.684527	user
4	Makhana Admin	admin@makhanamart.com	$2b$10$mCbX/Ojv/AljitwmRZr3IeaK.0/DTt1jqsJ06lJmRGLj7YBe1ikpa	2026-08-19 15:22:42.863814	admin
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_items (id, user_id, product_id, quantity) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, user_id, total_amount, status, created_at) FROM stdin;
1	1	1196.00	pending	2026-08-19 15:09:05.558891
2	1	598.00	pending	2026-08-19 15:09:46.052507
4	2	947.00	pending	2026-08-19 16:28:21.437811
3	1	598.00	confirmed	2026-08-19 15:10:32.605767
5	2	1974.00	pending	2026-08-19 16:48:16.358238
6	2	349.00	pending	2026-08-19 16:53:21.575809
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, product_id, quantity, price) FROM stdin;
1	1	1	4	299.00
2	2	1	2	299.00
3	3	1	2	299.00
4	4	1	2	299.00
5	4	2	1	349.00
6	5	1	2	299.00
7	5	2	3	349.00
8	5	3	1	329.00
9	6	2	1	349.00
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments (id, order_id, payment_id, amount, status, payment_method, created_at) FROM stdin;
\.


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 11, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_items_id_seq', 9, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 6, true);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- PostgreSQL database dump complete
--

\unrestrict Raa0fiv5SxZshmDVfvLV6ftrcYxPhe3dgLeHTp1FbVHGu1h2wLIqlZKJD8ANCDs

