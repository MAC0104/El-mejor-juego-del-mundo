class SofaScene extends Phaser.Scene {
    constructor() {
        super('SofaScene');
    }

    create() {
        // Fondo sofá
        const fondo = this.add.image(400, 200, 'fondo_sofa').setDisplaySize(800, 400);
        fondo.setDepth(0);

        // Suelo del fondo sofa con física (por delante del fondo)
        const ground = this.physics.add.sataticImage(400, 365, 'suelo_sofa');
        ground.setDisplaySize(800, 60);
        ground.refreshBody();
        ground.setDepth(1);

        // Límites del escenario
        this.physics.world.setBounds(0, 0, 800, 400);

        // Jugador con skin de Aitor normal (más grande)
        this.player = this.physics.add.sprite(50, 200, 'aitor_idle');
        this.player.setDisplaySize(190, 190);
        this.player.body.setSize(24, 34);
        this.player.body.setOffset(12, 14);
        this.player.body.setBounds(0.1);
        this.player.body.setCollideWorldBounds(true);
        this.player.setDepth(2);

        // Colisiones
        this.physics.add.collider(this.player, ground);

        // Boton volver
        const backButton = this.add.text(20, 20, '← Volver', {
            fontFamilly: '"Courier New", Courier, monospace',
            fontSize: '24px',
            color: '#fffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setInteractive({ useHandCursor: true }).setDepth(100);

        backButton.on('pointerover', () => backButton.setStyle({ color: '#ff69b4' }));
        backButton.on('pointerover', () => backButton.setStyle({ color: '#fff' }));
        backButton.on('pointerover', () => this.scene.start('HubScene'));


    }

}
