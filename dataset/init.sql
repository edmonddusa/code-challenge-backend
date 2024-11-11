create extension if not exists "uuid-ossp";

create table if not exists orders
(
    id          uuid                     default uuid_generate_v4() not null,
    amount      numeric(12, 2)                                      not null,
    "userId"    varchar(255)                                        not null,
    "createdAt" timestamp with time zone default now()              not null,
    status      varchar(255)                                        not null,
    type        varchar(255)                                        not null,
    "orderId"   varchar(255)                                        not null,
    constraint "PK_710e2d4957aa5878dfe94e4ac2f"
        primary key (id),
    constraint "UQ_41ba27842ac1a2c24817ca59eaa"
        unique ("orderId")
);

alter table orders
    owner to "eshop-root";

create table if not exists products
(
    id         uuid default uuid_generate_v4() not null,
    name       varchar(255)                    not null,
    vat_rate   numeric(12, 2)                  not null,
    price_unit numeric(12, 2)                  not null,
    constraint "PK_0806c755e0aca124e67c0cf6d7d"
        primary key (id),
    constraint "UQ_4c9fb58de893725258746385e16"
        unique (name)
);

alter table products
    owner to "eshop-root";

create table if not exists order_items
(
    id          serial,
    "orderId"   uuid                                   not null,
    "productId" uuid                                   not null,
    amount      numeric(12, 2)                         not null,
    "createdAt" timestamp with time zone default now() not null,
    count       integer                                not null,
    constraint "PK_005269d8574e6fac0493715c308"
        primary key (id),
    constraint "FK_f1d359a55923bb45b057fbdab0d"
        foreign key ("orderId") references orders,
    constraint "FK_cdb99c05982d5191ac8465ac010"
        foreign key ("productId") references products
);

alter table order_items
    owner to "eshop-root";

create table if not exists users
(
    id          varchar(255)                           not null,
    "createdAt" timestamp with time zone default now() not null,
    "lastSeen"  timestamp with time zone default now() not null,
    constraint "PK_a3ffb1c0c8416b9fc6f907b7433"
        primary key (id)
);

alter table users
    owner to "eshop-root";

create table if not exists basket_items
(
    id          serial,
    "userId"    varchar(255)                           not null,
    "productId" uuid                                   not null,
    "createdAt" timestamp with time zone default now() not null,
    count       integer                                not null,
    constraint "PK_9c916f29c8b703688fd4b1717c2"
        primary key (id),
    constraint "FK_2945698449c10cabf02d858cf7a"
        foreign key ("userId") references users,
    constraint "FK_bca53dec99316713d968c6a2141"
        foreign key ("productId") references products
            on delete cascade
);

alter table basket_items
    owner to "eshop-root";

INSERT INTO public.products (id, name, vat_rate, price_unit) VALUES ('4a3f004f-4b76-4796-adea-308a7c22a40e', 'Pizza', 0.20, 12.00);
INSERT INTO public.products (id, name, vat_rate, price_unit) VALUES ('405292b5-75a3-450b-8d6d-d0569f936c94', 'Sandwich', 0.05, 7.77);
INSERT INTO public.products (id, name, vat_rate, price_unit) VALUES ('71626d1d-7d04-4982-a5d3-0496731a488a', 'Water', 0.03, 2.02);
INSERT INTO public.products (id, name, vat_rate, price_unit) VALUES ('375e96af-3aaf-44f3-831c-9071dacee8bf', 'Beer', 0.25, 5.20);
INSERT INTO public.products (id, name, vat_rate, price_unit) VALUES ('42786839-a2a7-4393-b825-9f25d2dd3f89', 'Salad', 0.18, 8.21);
INSERT INTO public.products (id, name, vat_rate, price_unit) VALUES ('36e3abea-af86-4289-8c17-54c571d3bd59', 'Coffee', 0.10, 3.41);
INSERT INTO public.products (id, name, vat_rate, price_unit) VALUES ('8a88aee8-dbab-46a3-b334-c82b0d751540', 'Burger', 0.25, 13.40);
INSERT INTO public.products (id, name, vat_rate, price_unit) VALUES ('0b7706cd-9902-482c-a095-d5016ebb0e81', 'Bagel', 0.15, 6.00);
INSERT INTO public.products (id, name, vat_rate, price_unit) VALUES ('9360ca0f-ed75-449e-8ad1-1a15a7210f9a', 'Tea', 0.12, 2.50);
INSERT INTO public.products (id, name, vat_rate, price_unit) VALUES ('ae84b641-8ee4-432b-ac67-b333d57815a5', 'Pasta', 0.30, 17.33);
INSERT INTO public.products (id, name, vat_rate, price_unit) VALUES ('70b6324a-4bdf-4dcd-aa54-7f9e1af45b50', 'Salt', 0.10, 0.20);
