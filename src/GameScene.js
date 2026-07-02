class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // Fondo azul cielo
        this.cameras.main.setBackgroundColor('#87ceeb');

        // Dimensiones del mundo: 1800px de ancho, 400px de alto
        this.physics.world.setBounds(0, 0, 1800, 400);
        this.cameras.main.setBounds(0, 0, 1800, 400);

        // Suelo verde
        const ground = this.physics.add.image(900, 370, '__DEFAULT');
        ground.setDisplaySize(1800, 60);
        ground.setImmovable(true);
        ground.body.allowGravity = false;
        ground.setVisible(false);

        const groundVisual = this.add.rectangle(900, 370, 1800, 60, 0x228b22);

        // Personaje: Sprite animado
        this.player = this.physics.add.sprite(100, 200, 'aitor_cani_idle');
        this.player.setDisplaySize(120, 120);
        this.player.body.setSize(24, 34);
        this.player.body.setOffset(12, 14);
        this.player.body.setBounce(0.1);
        this.player.body.setCollideWorldBounds(true);

        // Animaciones
        this.anims.create({
            key: 'cani_idle',
            frames: this.anims.generateFrameNumbers('aitor_cani_idle', { start: 0, end: 3 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'cani_walk_right',
            frames: this.anims.generateFrameNumbers('aitor_cani_walk_right', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'cani_walk_left',
            frames: this.anims.generateFrameNumbers('aitor_cani_walk_left', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });

        // Colisión perfecta con el suelo usando Arcade Physics
        this.physics.add.collider(this.player, ground);

        // Cámara sigue al personaje (sin zoom)
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

        // Instituto
        const instituto = this.add.image(500, 340, 'instituto').setDisplaySize(380, 440).setOrigin(0.5, 1);
        // Quitamos el collider para poder pasar por delante
        this.instituto = instituto;

        // Aseguramos que el jugador esté por delante del instituto
        this.player.setDepth(5);
        this.instituto.setDepth(1);

        // Texto de interacción (sin fondo y más a la derecha)
        this.interactText = this.add.text(530, 270, 'Entrar\n(E)', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(10).setVisible(false);

        // Controles del teclado
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Botón Volver (fijo en pantalla)
        const backButton = this.add.text(20, 20, '← Volver', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setScrollFactor(0).setInteractive({ useHandCursor: true }).setDepth(100);

        backButton.on('pointerover', () => backButton.setStyle({ color: '#ff69b4' }));
        backButton.on('pointerout', () => backButton.setStyle({ color: '#ffffff' }));
        backButton.on('pointerdown', () => this.scene.start('HubScene'));
    }

    update() {
        const speed = 300;

        // Movimiento horizontal
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

        // Salto con flecha arriba
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.setVelocityY(-800);
        }

        // Interacción con el instituto
        if (this.instituto) {
            const distance = Math.abs(this.player.x - this.instituto.x);
            if (distance < 150) {
                this.interactText.setVisible(true);
                // El texto se queda fijo en la entrada

                if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
                    this.scene.start('PasilloScene');
                }
            } else {
                this.interactText.setVisible(false);
            }
        }
    }
}
