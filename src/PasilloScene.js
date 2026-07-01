class PasilloScene extends Phaser.Scene {
    constructor() {
        super('PasilloScene');
    }

    create() {
        // Fondo pasillo (capa base)
        const fondo = this.add.image(400, 200, 'fondo_pasillo').setDisplaySize(800, 400);
        fondo.setDepth(0);

        // Suelo pasillo con física (por delante del fondo)
        const ground = this.physics.add.staticImage(400, 365, 'suelo_pasillo');
        ground.setDisplaySize(800, 60);
        ground.refreshBody();
        ground.setDepth(1);

        // Configuración del mundo
        this.physics.world.setBounds(0, 0, 800, 400);

        // Jugador con skin aitor_cani (más grande en el pasillo)
        this.player = this.physics.add.sprite(50, 200, 'aitor_cani_idle');
        this.player.setDisplaySize(190, 190);
        this.player.body.setSize(24, 34);
        this.player.body.setOffset(12, 14);
        this.player.body.setBounce(0.1);
        this.player.body.setCollideWorldBounds(true);
        this.player.setDepth(2); // Jugador por delante del fondo
 
        // Colisiones
        this.physics.add.collider(this.player, ground);
 
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
 
        // Animaciones (reutilizamos las de GameScene o las definimos aquí)
        if (!this.anims.exists('cani_idle')) {
            this.anims.create({
                key: 'cani_idle',
                frames: this.anims.generateFrameNumbers('aitor_cani_idle', { start: 0, end: 3 }),
                frameRate: 3,
                repeat: -1
            });
        }
        if (!this.anims.exists('cani_walk_right')) {
            this.anims.create({
                key: 'cani_walk_right',
                frames: this.anims.generateFrameNumbers('aitor_cani_walk_right', { start: 0, end: 3 }),
                frameRate: 4,
                repeat: -1
            });
        }
        if (!this.anims.exists('cani_walk_left')) {
            this.anims.create({
                key: 'cani_walk_left',
                frames: this.anims.generateFrameNumbers('aitor_cani_walk_left', { start: 0, end: 3 }),
                frameRate: 4,
                repeat: -1
            });
        }
 
        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();
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
 
        // Salto
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.setVelocityY(-800);
        }
 
        // Transición a StairsScene al llegar al borde derecho
        // El límite es menor (650) porque el personaje es más grande
        if (this.player.x > 650) {
            this.scene.start('StairsScene');
        }
    }
}
