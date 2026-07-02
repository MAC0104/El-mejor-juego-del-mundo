class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        // Spritesheets Personajes
        this.load.spritesheet('aitor_idle', 'sprites/aitor_idle.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('aitor_walk_right', 'sprites/aitor_walk_right.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('aitor_walk_left', 'sprites/aitor_walk_left.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('aitor_cani_idle', 'sprites/aitor_cani_idle.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('aitor_cani_walk_right', 'sprites/aitor_cani_walk_right.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('aitor_cani_walk_left', 'sprites/aitor_cani_walk_left.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('diego_cani_idle', 'sprites/diego_cani_idle.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('chloe_idle', 'sprites/chloe_idle.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('keyla_otaku_idle', 'sprites/keyla_otaku_idle.png', { frameWidth: 48, frameHeight: 48 });

        // Fotos para el móvil
        this.load.image('foto_diego', 'sprites/foto_diego.png');
        this.load.image('foto_keyla', 'sprites/foto_keyla.png');
        this.load.image('foto_aitor', 'sprites/foto_aitor.png');

        // Fondos y Suelos
        this.load.image('fondo_pasillo', 'fondos/fondo_pasillo.png');
        this.load.image('suelo_pasillo', 'fondos/suelo_pasillo.png');
        this.load.image('fondo_escalera', 'fondos/fondo_escalera.png');
        this.load.image('suelo_escalera', 'fondos/suelo_escalera.png');
        this.load.image('fondo_patio', 'fondos/fondo_patio.png');
        this.load.image('suelo_patio', 'fondos/suelo_patio.png');
        this.load.image('instituto', 'fondos/instituto.png');

        // Puertas y Otros
        this.load.image('puerta', 'fondos/puerta.png');
        this.load.image('puerta_cerrada', 'fondos/puerta_cerrada.png');
        this.load.image('plataforma', 'fondos/puerta_cerrada.png');

        // Diálogos
        this.load.image('dialogo_npc', 'fondos/dialogo_npc.png');
        this.load.image('dialogo_jugador', 'fondos/dialogo_jugador.png');

        // Audios
        this.load.audio('audio_diego', 'audio/audio_diego_conversacionscene.ogg');

        // Imágenes
        this.load.image('pregunta1_silencio', 'Imágenes/pregunta1_SilencioScene.jpg');
        this.load.image('pregunta2_silencio', 'Imágenes/pregunta2_SilencioScene.jpg');
        this.load.image('pregunta3_silencio', 'Imágenes/pregunta3_SilencioScene.jpg');
        this.load.image('pregunta4_silencio', 'Imágenes/pregunta4_SilencioScene.jpg');
    }

    create() {
        // Fondo negro
        this.cameras.main.setBackgroundColor('#000000');

        // Estrellas animadas
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            let x = Phaser.Math.Between(0, 800);
            let y = Phaser.Math.Between(0, 400);
            let size = Phaser.Math.Between(1, 3);
            let star = this.add.rectangle(x, y, size, size, 0xffffff);
            star.alpha = Phaser.Math.FloatBetween(0.2, 1);
            this.stars.push(star);
        }

        // Animar estrellas
        this.time.addEvent({
            delay: 200,
            loop: true,
            callback: () => {
                this.stars.forEach(star => {
                    if (Math.random() > 0.5) {
                        star.alpha = Phaser.Math.FloatBetween(0.2, 1);
                    }
                });
            }
        });

        // Título con brillo rosa
        const titleText = this.add.text(400, 100, 'Nuestra Historia', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '64px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        titleText.setShadow(0, 0, '#ff69b4', 15, true, true);

        // Corazón con destellos
        const heartText = this.add.text(400, 160, '💖', {
            fontSize: '48px',
            padding: { x: 10, y: 10 }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: heartText,
            scaleX: 1.3,
            scaleY: 1.3,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            duration: 1000
        });

        // Botón JUGAR dorado
        const playButton = this.add.rectangle(400, 250, 200, 60, 0xffd700)
            .setInteractive({ useHandCursor: true });

        const playText = this.add.text(400, 250, 'JUGAR', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '32px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        playButton.on('pointerover', () => {
            playButton.fillColor = 0xffe866; // Dorado más claro
        });

        playButton.on('pointerout', () => {
            playButton.fillColor = 0xffd700; // Dorado original
        });

        playButton.on('pointerdown', () => {
            this.scene.start('HubScene');
        });
    }
}
