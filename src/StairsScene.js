class StairsScene extends Phaser.Scene {
    constructor() {
        super('StairsScene');
    }

    create() {
        // Escenario de fondo (capa base)
        this.add.image(400, 200, 'fondo_escalera').setDisplaySize(800, 400).setDepth(0);

        // Suelo escaleras (capa por delante del fondo)
        this.add.image(400, 200, 'suelo_escalera').setDisplaySize(800, 400).setDepth(1);

        // Grupo para todos los suelos
        this.suelos = this.physics.add.staticGroup();

        // Definición ultra-precisa de los escalones para que coincidan con suelo_escalera.png
        // (Ajustado: El suelo ahora está casi a la altura del penúltimo escalón)
        const stepsData = [
            { x: 0, w: 128, y: 112 },   // Plataforma superior
            { x: 128, w: 48, y: 137 },  // Escalón 1
            { x: 176, w: 48, y: 162 },  // Escalón 2
            { x: 224, w: 48, y: 187 },  // Escalón 3
            { x: 272, w: 48, y: 212 },  // Escalón 4
            { x: 320, w: 48, y: 237 },  // Escalón 5
            { x: 368, w: 48, y: 262 },  // Escalón 6
            { x: 416, w: 48, y: 287 },  // Escalón 7
            { x: 464, w: 48, y: 312 },  // Escalón 8
            { x: 512, w: 98, y: 337 },  // Escalón 9 (Ajustado para cerrar el hueco)
            { x: 610, w: 190, y: 340 }  // Suelo 
        ];


        stepsData.forEach(data => {
            // Creamos rectángulos invisibles que actúan como colisión sobre el dibujo
            const step = this.add.rectangle(data.x + data.w / 2, data.y + 200, data.w, 400, 0x000000, 0);
            this.physics.add.existing(step, true);
            step.body.setSize(data.w, 400); // Aseguramos el tamaño de la colisión
            this.suelos.add(step);
        });

        // Jugador (Subimos su posición para que no aparezca dentro del suelo)
        this.player = this.physics.add.sprite(50, 30, 'aitor_cani_idle');
        this.player.setDisplaySize(140, 140);
        this.player.body.setSize(30, 34); // Un poco más ancho para evitar huecos
        this.player.body.setOffset(9, 14);
        this.player.body.setBounce(0.1);
        this.player.body.setCollideWorldBounds(true);
        this.player.setDepth(5);

        // Función personalizada para que puedas añadir suelos fácilmente
        // Solo tienes que escribir: this.añadirSuelo(x, y, 'nombre_de_tu_imagen');
        this.añadirSuelo = (x, y, key, ancho, alto) => {
            const nuevoSuelo = this.physics.add.staticImage(x, y, key);
            if (ancho && alto) nuevoSuelo.setDisplaySize(ancho, alto);
            nuevoSuelo.refreshBody();
            this.suelos.add(nuevoSuelo);
            return nuevoSuelo;
        };

        // Variable para el Coyote Time (salto fluido)
        this.lastGroundedTime = 0;

        // Colisiones generales
        this.physics.add.collider(this.player, this.suelos);

        // AUTOMATIZACIÓN: Cualquier imagen que añadas con la palabra "suelo" en su nombre
        // se convertirá automáticamente en un suelo sólido con esta función.
        this.automatizarSuelos = () => {
            this.children.list.forEach(hijo => {
                if (hijo.texture && hijo.texture.key.includes('suelo') && !hijo.body) {
                    this.physics.add.existing(hijo, true);
                    this.suelos.add(hijo);
                }
            });
        };

        // Ejecutamos la automatización al final del create
        this.automatizarSuelos();

        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();

        // Botón Volver
        const backButton = this.add.text(20, 20, '← Volver', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setInteractive({ useHandCursor: true }).setDepth(100);

        backButton.on('pointerover', () => backButton.setStyle({ color: '#ff69b4' }));
        backButton.on('pointerout', () => backButton.setStyle({ color: '#ffffff' }));
        backButton.on('pointerdown', () => this.scene.start('HubScene'));
    }

    update() {
        const speed = 300;

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-speed);
            this.player.anims.play('cani_walk_left', true);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(speed);
            this.player.anims.play('cani_walk_right', true);
        } else {
            this.player.body.setVelocityX(0);
            this.player.anims.play('cani_idle', true);
        }

        // Lógica de salto mejorada (Coyote Time)
        if (this.player.body.touching.down || this.player.body.blocked.down) {
            this.lastGroundedTime = this.time.now;
        }

        const canJump = (this.time.now - this.lastGroundedTime < 150); // 150ms de margen

        if (this.cursors.up.isDown && canJump) {
            this.player.body.setVelocityY(-900); // Salto un poco más fuerte para escaleras
            this.lastGroundedTime = 0; // Evitar saltos infinitos
        }

        // Transición al Patio al llegar al borde derecho
        if (this.player.x > 680) {
            this.scene.start('PatioScene', { from: 'StairsScene' });
        }

    }
}
