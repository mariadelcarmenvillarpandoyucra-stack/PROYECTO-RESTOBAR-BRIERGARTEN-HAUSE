-- ============================================================================
-- Biergärten Haus — Datos semilla
-- Usuarios de prueba (contraseñas hasheadas con bcrypt):
--   admin  / dueno123     (rol: dueño)
--   carlos / mesero123    (rol: mesero)
--   luis   / mesero123    (rol: mesero)
--   ana    / mesero123    (rol: mesero)
-- ============================================================================

INSERT INTO usuarios (username, password_hash, role, display_name, role_label) VALUES
  ('admin',  '$2a$10$PEaEhrjyNrIVPdhu0OwVQOS0gM4dSAAOhirSPFpb3nm07vH3RTp5u', 'dueno',  'Administrador', 'Dueño'),
  ('carlos', '$2a$10$zdgdfPwIdW2Ok9LAggRZN.vmpHfxSzSEUuteOC1WoNavzG0mJQG6G', 'mesero', 'Carlos',        'Mesero'),
  ('luis',   '$2a$10$IMHXNeaxiHfGTGw.lDdB0O/I/urVot208/G1x2Pt/JR3v2x/Q2LRG', 'mesero', 'Luis',          'Mesero'),
  ('ana',    '$2a$10$.BSvRUfAZko9CCQ1s.7Eaed6e/R.X44RU6EXqkVOFL8WW3yK/uceG', 'mesero', 'Ana',           'Mesero')
ON CONFLICT (username) DO NOTHING;

INSERT INTO mesas (num, estado, hora_apertura) VALUES
  (1, 'libre',   NULL),
  (2, 'ocupada', now() - interval '9 minutes'),
  (3, 'ocupada', now() - interval '22 minutes'),
  (4, 'libre',   NULL),
  (5, 'cuenta',  now() - interval '38 minutes'),
  (6, 'libre',   NULL),
  (7, 'libre',   NULL),
  (8, 'ocupada', now() - interval '4 minutes')
ON CONFLICT (num) DO NOTHING;

INSERT INTO productos (id, nombre, categoria, precio, icon, imagen, descripcion) VALUES
  ('p1',  'Hamburguesa Haus',            'Comidas',            45, 'burger', NULL, 'Carne de res, queso cheddar, tocino y salsa de la casa en pan brioche.'),
  ('p2',  'Pizza Biergärten',            'Comidas',            55, 'pizza',  NULL, 'Masa artesanal, mozzarella, salame y albahaca fresca.'),
  ('p3',  'Alitas BBQ',                  'Comidas',            35, 'wings',  NULL, '8 alitas bañadas en salsa BBQ ahumada, acompañadas de aderezo ranch.'),
  ('p4',  'Plato de la Casa',            'Comidas',            60, 'plate',  NULL, 'Selección de carnes a la parrilla con guarniciones de la casa.'),
  ('p5',  'Papas Especiales',            'Comidas',            20, 'papas',  NULL, 'Papas fritas con queso cheddar, tocino y cebollín.'),
  ('p6',  'Cóctel Tropical',             'Cócteles',           32, 'coctel', NULL, 'Ron, jugo de maracuyá, piña y un toque de menta.'),
  ('p7',  'Mojito Biergärten',           'Cócteles',           30, 'coctel', NULL, 'Ron blanco, hierbabuena, limón y soda bien fría.'),
  ('p8',  'Cerveza Artesanal IPA 500ml', 'Cerveza artesanal',  25, 'cerveza',NULL, 'IPA de la casa, amarga y aromática, notas cítricas.'),
  ('p9',  'Cerveza Rubia 500ml',         'Cerveza artesanal',  22, 'cerveza',NULL, 'Lager rubia suave, ligera y refrescante.'),
  ('p10', 'Cerveza Negra 500ml',         'Cerveza artesanal',  24, 'cerveza',NULL, 'Stout tostada con notas a café y chocolate.'),
  ('p11', 'Refresco',                    'Refrescos',          10, 'soda',   NULL, 'Línea de gaseosas heladas, sabor a elección.'),
  ('p12', 'Limonada de la Casa',         'Refrescos',          12, 'soda',   NULL, 'Limonada natural con un toque de hierbabuena.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO barriles (id, nombre, nivel, capacidad) VALUES
  ('b1', 'Cerveza Rubia',          72, '50L'),
  ('b2', 'Cerveza Negra',          34, '50L'),
  ('b3', 'Cerveza Roja / Amber',   12, '30L'),
  ('b4', 'Cerveza Artesanal IPA',  58, '30L')
ON CONFLICT (id) DO NOTHING;

-- Pedidos en curso de ejemplo
INSERT INTO pedidos (id, mesa, mesero_id, mesero, estado, total, hora, ts) VALUES
  (101, 3, (SELECT id FROM usuarios WHERE username='carlos'), 'Carlos', 'preparando', 145, to_char(now(), 'HH24:MI'), now() - interval '20 minutes'),
  (102, 5, (SELECT id FROM usuarios WHERE username='carlos'), 'Carlos', 'entregado',  80,  to_char(now(), 'HH24:MI'), now() - interval '35 minutes'),
  (103, 2, (SELECT id FROM usuarios WHERE username='carlos'), 'Carlos', 'pendiente',  145, to_char(now(), 'HH24:MI'), now() - interval '6 minutes'),
  (104, 8, (SELECT id FROM usuarios WHERE username='carlos'), 'Carlos', 'listo',      104, to_char(now(), 'HH24:MI'), now() - interval '3 minutes')
ON CONFLICT (id) DO NOTHING;
SELECT setval('pedidos_id_seq', 105, false);

INSERT INTO pedido_items (pedido_id, nombre, cant, precio) VALUES
  (101, 'Hamburguesa Haus', 2, 45),
  (101, 'Pizza Biergärten', 1, 55),
  (102, 'Plato de la Casa', 1, 60),
  (102, 'Refresco', 2, 10),
  (103, 'Alitas BBQ', 2, 35),
  (103, 'Cerveza Artesanal IPA 500ml', 3, 25),
  (104, 'Papas Especiales', 2, 20),
  (104, 'Cóctel Tropical', 2, 32);

-- Ventas de ejemplo (histórico de hoy)
INSERT INTO ventas (id, mesa, mesero_id, mesero, subtotal, propina, metodo_pago, calificacion, hora, ts) VALUES
  (1, 4, (SELECT id FROM usuarios WHERE username='carlos'), 'Carlos', 89,  10, 'efectivo', 5, to_char(now(), 'HH24:MI'), now() - interval '240 minutes'),
  (2, 6, (SELECT id FROM usuarios WHERE username='ana'),    'Ana',    75,  8,  'qr',       5, to_char(now(), 'HH24:MI'), now() - interval '210 minutes'),
  (3, 1, (SELECT id FROM usuarios WHERE username='luis'),   'Luis',   120, 12, 'qr',       4, to_char(now(), 'HH24:MI'), now() - interval '190 minutes'),
  (4, 7, (SELECT id FROM usuarios WHERE username='ana'),    'Ana',    120, 15, 'efectivo', 5, to_char(now(), 'HH24:MI'), now() - interval '160 minutes'),
  (5, 3, (SELECT id FROM usuarios WHERE username='carlos'), 'Carlos', 116, 10, 'qr',       5, to_char(now(), 'HH24:MI'), now() - interval '140 minutes'),
  (6, 2, (SELECT id FROM usuarios WHERE username='luis'),   'Luis',   110, 0,  'efectivo', 3, to_char(now(), 'HH24:MI'), now() - interval '120 minutes'),
  (7, 8, (SELECT id FROM usuarios WHERE username='ana'),    'Ana',    110, 12, 'qr',       5, to_char(now(), 'HH24:MI'), now() - interval '95 minutes'),
  (8, 5, (SELECT id FROM usuarios WHERE username='carlos'), 'Carlos', 100, 10, 'efectivo', 4, to_char(now(), 'HH24:MI'), now() - interval '70 minutes')
ON CONFLICT (id) DO NOTHING;
SELECT setval('ventas_id_seq', 9, false);

INSERT INTO venta_items (venta_id, nombre, cant) VALUES
  (1, 'Hamburguesa Haus', 1),
  (1, 'Cerveza Rubia 500ml', 2),
  (2, 'Pizza Biergärten', 1),
  (2, 'Refresco', 2),
  (3, 'Alitas BBQ', 2),
  (3, 'Cerveza Artesanal IPA 500ml', 2),
  (4, 'Plato de la Casa', 2),
  (5, 'Cóctel Tropical', 3),
  (5, 'Papas Especiales', 1),
  (6, 'Hamburguesa Haus', 2),
  (6, 'Refresco', 2),
  (7, 'Pizza Biergärten', 2),
  (8, 'Mojito Biergärten', 2),
  (8, 'Papas Especiales', 2);

INSERT INTO notificaciones (id, mesero, mesa, pedido_id, mensaje, hora, leida, ts) VALUES
  (1, 'Carlos', 8, 104, 'Pedido #104 listo para servir — Mesa 8', to_char(now(), 'HH24:MI'), false, now() - interval '3 minutes')
ON CONFLICT (id) DO NOTHING;
SELECT setval('notificaciones_id_seq', 2, false);
