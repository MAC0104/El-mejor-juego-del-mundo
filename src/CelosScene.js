
class CelosScene extends Phaser.Scene {
    constructor() {
        super('CelosScene');
    }

    preload() {
        this.load.image('fondo_celos', 'fondos/fondo_celos.png');
        this.load.spritesheet('aitor_cani_walk_right', 'sprites/aitor_cani_walk_right.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('aitor_cani_idle', 'sprites/aitor_cani_idle.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('chloe_idle', 'sprites/chloe_idle.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('chloe_walk_right', 'sprites/chloe_walk_right.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('aitor_chloe', 'sprites/aitor_chloe.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('keyla_otaku_idle_left', 'sprites/keyla_otaku_idle_left.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('keyla_otaku_idle_right', 'sprites/keyla_otaku_idle_right.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('keyla_otaku_walk_right', 'sprites/keyla_otaku_walk_right.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('burbuja_keyla', 'sprites/burbuja_keyla.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('burbuja_pensamiento', 'sprites/burbuja_pensamiento.png', { frameWidth: 48, frameHeight: 48 });
        this.load.image('nube', 'sprites/nube.png');
        this.load.image('nube_positiva', 'sprites/nube_positiva.png');
        this.load.spritesheet('abrazo', 'sprites/abrazo.png', { frameWidth: 48, frameHeight: 48 });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87ceeb');

        this.cursors = this.input.keyboard.createCursorKeys();
        this.isFase2 = false;
        this.burbujasSuelo = false;
        this.burbujasCaidas = 0;
        this.gameOverActivo = false;
        this.burbujasGroup = this.physics.add.group();

        this.pensamientos = [
            "Seguro que ahora le caigo mal...",
            "Le gusta Chloe",
            "Soy imbécil",
            "Me tengo que desenamorar...",
            "¿Por qué me tiene que gustar a mí?",
            "Seguro que le gusto como amiga...",
            "Tendría que haberme callado",
            "Todo mal",
            "¿Y ahora qué?",
            "Me quiero ir a casa"
        ];
        Phaser.Utils.Array.Shuffle(this.pensamientos);

        // Suelo gris claro visual
        const groundVisual = this.add.rectangle(400, 385, 800, 60, 0xcccccc);

        // Suelo físico invisible
        this.ground = this.physics.add.image(400, 385, '__DEFAULT');
        this.ground.setDisplaySize(800, 60);
        this.ground.setImmovable(true);
        this.ground.body.allowGravity = false;
        this.ground.setVisible(false);

        // Instituto
        this.add.image(200, 355, 'instituto').setDisplaySize(380, 440).setOrigin(0.5, 1).setDepth(1);

        // Fondo celos
        this.add.image(340, 400, 'fondo_celos').setDisplaySize(480, 400).setOrigin(0, 1).setDepth(2);

        this.physics.world.setBounds(0, 0, 800, 400);
        this.cameras.main.setBounds(0, 0, 800, 400);

        // Crear animaciones
        this.anims.create({ key: 'anim_burbuja_keyla', frames: this.anims.generateFrameNumbers('burbuja_keyla', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'anim_burbuja_pensamiento', frames: this.anims.generateFrameNumbers('burbuja_pensamiento', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'anim_abrazo', frames: this.anims.generateFrameNumbers('abrazo', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'anim_aitor_chloe', frames: this.anims.generateFrameNumbers('aitor_chloe', { start: 0, end: 3 }), frameRate: 3, repeat: -1 });
        this.anims.create({ key: 'anim_aitor_cani_walk_right', frames: this.anims.generateFrameNumbers('aitor_cani_walk_right', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'anim_aitor_cani_idle', frames: this.anims.generateFrameNumbers('aitor_cani_idle', { start: 0, end: 3 }), frameRate: 3, repeat: -1 });
        this.anims.create({ key: 'anim_chloe_idle', frames: this.anims.generateFrameNumbers('chloe_idle', { start: 0, end: 3 }), frameRate: 3, repeat: -1 });
        this.anims.create({ key: 'anim_chloe_walk_right', frames: this.anims.generateFrameNumbers('chloe_walk_right', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'anim_keyla_walk_right', frames: this.anims.generateFrameNumbers('keyla_otaku_walk_right', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'anim_keyla_idle_right', frames: this.anims.generateFrameNumbers('keyla_otaku_idle_right', { start: 0, end: 3 }), frameRate: 3, repeat: -1 });
        this.anims.create({ key: 'anim_keyla_idle_left', frames: this.anims.generateFrameNumbers('keyla_otaku_idle_left', { start: 0, end: 3 }), frameRate: 3, repeat: -1 });

        // Posiciones iniciales
        this.keyla = this.add.sprite(200, 355, 'keyla_otaku_walk_right').setOrigin(0.5, 1).setScale(3.5).setDepth(3);
        this.keyla.play('anim_keyla_walk_right');

        const chloeSep = this.add.sprite(130, 355, 'chloe_walk_right').setOrigin(0.5, 1).setScale(3.5).setDepth(3);
        chloeSep.play('anim_chloe_walk_right');

        const aitorSep = this.add.sprite(115, 355, 'aitor_cani_walk_right').setOrigin(0.5, 1).setScale(3.5).setDepth(3);
        aitorSep.play('anim_aitor_cani_walk_right');

        // Sprite combinado (oculto de inicio)
        const aitorChloe = this.add.sprite(0, 355, 'aitor_chloe').setOrigin(0.5, 1).setScale(3.5).setDepth(3).setVisible(false);


        // Tween caminata
        this.tweens.add({
            targets: [this.keyla, aitorSep, chloeSep],
            x: '+=500',
            duration: 8000,
            onComplete: () => {
                this.keyla.play('anim_keyla_idle_right');
                aitorSep.setVisible(false);
                chloeSep.setVisible(false);

                aitorChloe.setX(this.keyla.x - 80);
                aitorChloe.setVisible(true);
                aitorChloe.play('anim_aitor_chloe');

                const bubble = this.add.container(aitorChloe.x, 220).setDepth(20);
                const rect = this.add.rectangle(0, 0, 240, 40, 0xffffff).setStrokeStyle(2, 0x000000);
                const text = this.add.text(0, 0, '¿Qué pasa, estás celosa?', {
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: '14px',
                    color: '#000000',
                    align: 'center',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
                bubble.add([rect, text]);

                this.time.delayedCall(1000, () => {
                    this.keyla.play('anim_keyla_idle_left');

                    this.time.delayedCall(1500, () => {
                        this.keyla.play('anim_keyla_idle_right');

                        // FASE 1 — La burbuja de Keyla sube
                        this.keyla.setVisible(false);
                        const burbujaKeyla = this.add.sprite(this.keyla.x, this.keyla.y, 'burbuja_keyla').setOrigin(0.5, 1).setDepth(20).setScale(3.5);
                        burbujaKeyla.play('anim_burbuja_keyla');

                        this.tweens.add({
                            targets: burbujaKeyla,
                            y: -50,
                            duration: 2000,
                            onComplete: () => {
                                burbujaKeyla.destroy();

                                // INICIO FASE 2
                                aitorChloe.destroy();
                                bubble.destroy();

                                const chloeFase2 = this.add.sprite(580, 355, 'chloe_idle').setOrigin(0.5, 1).setScale(3.5).setDepth(3);
                                chloeFase2.play('anim_chloe_walk_right');
                                this.tweens.add({
                                    targets: chloeFase2,
                                    x: 900,
                                    duration: 3000,
                                    onComplete: () => { chloeFase2.destroy(); }
                                });

                                this.playerAitor = this.physics.add.sprite(580, 355, 'aitor_cani_idle').setOrigin(0.5, 1).setScale(3.5).setDepth(3);
                                this.playerAitor.play('anim_aitor_cani_idle');
                                this.playerAitor.setCollideWorldBounds(true);
                                this.playerAitor.setSize(20, 24);
                                this.playerAitor.setOffset(14, 24);

                                this.physics.add.collider(this.playerAitor, this.ground);
                                this.isFase2 = true;

                                this.burbujasTimer = this.time.addEvent({
                                    delay: 1500,
                                    callback: this.spawnBurbuja,
                                    callbackScope: this,
                                    repeat: 9
                                });

                                this.physics.add.overlap(this.playerAitor, this.burbujasGroup, this.hitBurbuja, null, this);
                            }
                        });
                    });
                });
            }
        });

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
        backButton.on('pointerdown', () => this.scene.start('HubScene', { nivel2Abierto: true, nivel3Abierto: true, desde: 'nivel2' }));
    }

    spawnBurbuja() {
        if (this.burbujasSuelo) return;

        const x = Phaser.Math.Between(50, 750);
        const bubble = this.burbujasGroup.create(x, -50, 'burbuja_pensamiento');
        bubble.setScale(2.5);
        bubble.setDepth(20);
        bubble.play('anim_burbuja_pensamiento');
        bubble.body.allowGravity = false;
        bubble.setVelocityY(150);
        bubble.exploded = false;

        const msg = this.pensamientos[this.burbujasCaidas];
        const textObj = this.add.text(x, -50, msg, {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '18px',
            color: '#000000',
            align: 'center',
            fontStyle: 'bold',
            wordWrap: { width: 110, useAdvancedWrap: true }
        }).setOrigin(0.5).setDepth(21);

        bubble.textObj = textObj;
        this.burbujasCaidas++;

        if (this.burbujasCaidas === 8) {
            this.startFase3();
        }
    }

    hitBurbuja(player, bubble) {
        if (bubble.exploded) return;
        bubble.exploded = true;
        bubble.body.checkCollision.none = true;
        bubble.setVelocityY(0);
        if (bubble.textObj) bubble.textObj.destroy();

        bubble.setTint(0xffffff);
        this.tweens.add({
            targets: bubble,
            scale: 7,
            alpha: 0,
            angle: Phaser.Math.Between(-90, 90),
            duration: 500,
            ease: 'Cubic.easeOut',
            onComplete: () => { bubble.destroy(); }
        });
    }

    gameOverBurbujas() {
        this.burbujasSuelo = true;
        this.gameOverActivo = true;
        if (this.burbujasTimer) this.burbujasTimer.remove();

        this.physics.pause();
        this.playerAitor.anims.stop();

        const overlay = this.add.rectangle(400, 200, 800, 400, 0x000000, 0.7).setDepth(100);

        const gameOverText = this.add.text(400, 150, '🫧 ¡Pop! ¡Pop! ¡Pop! 🫧', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(101);

        const btnRetry = this.add.rectangle(400, 250, 200, 50, 0xffd700).setDepth(101).setInteractive({ useHandCursor: true });
        const textRetry = this.add.text(400, 250, 'REINTENTAR', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '20px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(102);

        btnRetry.on('pointerdown', () => {
            this.input.setDefaultCursor('default');
            this.scene.restart();
        });
        btnRetry.on('pointerover', () => { btnRetry.setFillStyle(0xffea00); });
        btnRetry.on('pointerout', () => { btnRetry.setFillStyle(0xffd700); });
    }

    startFase3() {
        console.log("INICIO FASE 3");

        // Limpiar burbujas pendientes para evitar Game Over accidentales
        if (this.burbujasGroup) {
            this.burbujasGroup.getChildren().forEach(b => {
                if (b.textObj) b.textObj.destroy();
            });
            this.burbujasGroup.clear(true, true);
        }
        if (this.burbujasTimer) this.burbujasTimer.remove();

        this.golpesBurbuja = 0;
        this.isHittingBubble = false;
        this.textosGolpes = [
            "No le gusto...",
            "Solo quiere ser amigo",
            "Me tengo que olvidar de él",
            "No debería haberle dicho nada",
            "..."
        ];

        this.burbujaFase3 = this.physics.add.sprite(400, -50, 'burbuja_keyla').setOrigin(0.5, 0.5).setScale(3.5).setDepth(20);
        this.burbujaFase3.play('anim_burbuja_keyla');
        this.burbujaFase3.body.allowGravity = false;

        this.tweens.add({
            targets: this.burbujaFase3,
            y: 200,
            duration: 3000,
            ease: 'Quad.easeInOut',
            onComplete: () => {
                this.physics.add.overlap(this.playerAitor, this.burbujaFase3, this.hitBurbujaKeyla, null, this);
            }
        });
    }

    hitBurbujaKeyla(player, bubble) {
        if (this.isHittingBubble) return;
        this.isHittingBubble = true;
        if (!this.burbujaFase3 || !this.burbujaFase3.body) return;

        this.golpesBurbuja++;

        const msg = this.textosGolpes[this.golpesBurbuja - 1];
        const floatText = this.add.text(bubble.x, bubble.y - 50, msg, {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 5, y: 5 },
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(10);

        this.tweens.add({
            targets: floatText,
            y: floatText.y - 100,
            alpha: 0,
            duration: 1500,
            onComplete: () => floatText.destroy()
        });

        if (this.golpesBurbuja >= 5) {
            bubble.setTint(0xffffff);
            const bx = bubble.x;
            const by = bubble.y;
            bubble.destroy();

            // Aparece Keyla y cae
            this.keyla.setPosition(bx, by);
            this.keyla.setVisible(true);
            this.physics.add.existing(this.keyla);
            this.keyla.body.allowGravity = true;
            this.keyla.setDepth(3);

            // Añadir colisión con el suelo para que no se caiga del mundo
            this.physics.add.collider(this.keyla, this.ground);

            // Esperar a que toque el suelo para mostrar el texto final
            this.time.delayedCall(2000, () => {
                //Keyla camina al extremo derecho
                this.keyla.play('anim_keyla_walk_right');
                this.tweens.add({
                    targets: this.keyla,
                    x: 720,
                    duration: 2000,
                    onComplete: () => {
                        this.keyla.play('anim_keyla_idle_left');

                        //Overlay gris para efecto b/n
                        this.overlayBN = this.add.rectangle(400, 200, 800, 400, 0x000000, 0.55).setDepth(50);
                        //Iniciar escena de nubes
                        this.nubesTextos = [
                            'Fue un momento duro...',
                            'ambos lo pasamos mal...',
                            'nos costó un poco reconciliarnos',
                            'pero ahora no puedo estar\nmás agradecida de que pasase así'

                        ];
                        this.nubesApartadas = 0;
                        this.nubesGroup = this.physics.add.staticGroup();
                        this.nubesPositivasVisibles = [];
                        this.isFaseNubes = true;

                        this.spawnNubeSiguiente();

                    }
                });
            });
        } else {
            this.tweens.add({
                targets: bubble,
                scale: 3.8,
                duration: 100,
                yoyo: true
            });

            this.time.delayedCall(500, () => {
                this.isHittingBubble = false;
            });
        }
    }

    update() {
        // Aitor se puede mover siempre que exista y no haya game over activo
        if (this.playerAitor && this.playerAitor.body && !this.gameOverActivo) {
            const speed = 250;

            if (this.cursors.left.isDown) {
                this.playerAitor.body.setVelocityX(-speed);
                this.playerAitor.anims.play('anim_aitor_cani_walk_right', true);
                this.playerAitor.setFlipX(true);
            } else if (this.cursors.right.isDown) {
                this.playerAitor.body.setVelocityX(speed);
                this.playerAitor.anims.play('anim_aitor_cani_walk_right', true);
                this.playerAitor.setFlipX(false);
            } else {
                this.playerAitor.body.setVelocityX(0);
                this.playerAitor.anims.play('anim_aitor_cani_idle', true);
            }

            if (this.cursors.up.isDown && this.playerAitor.body.touching.down) {
                this.playerAitor.body.setVelocityY(-650);
            }
        }

        // Seguimiento de texto de burbujas y detección de game over
        if (this.burbujasGroup && !this.gameOverActivo) {
            this.burbujasGroup.getChildren().forEach(b => {
                if (b.active && !b.exploded) {
                    if (b.textObj) {
                        b.textObj.x = b.x;
                        b.textObj.y = b.y;
                    }
                    if (b.y >= 325 && !this.burbujasSuelo) {
                        this.gameOverBurbujas();
                    }
                }
            });
        }
    }
    spawnNubeSiguiente() {
        if (this.nubesApartadas >= this.nubesTextos.length) {
            this.startFaseAbrazo();
            return;
        }

        const posicionesX = [130, 290, 450, 610];
        const x = posicionesX[this.nubesApartadas];

        const nube = this.physics.add.image(x, -60, 'nube').setScale(3).setDepth(55);
        nube.body.allowGravity = false;
        nube.setVelocityY(120);
        nube.apartada = false;

        const nubePositiva = this.add.image(x, 140, 'nube_positiva').setScale(3).setDepth(54).setVisible(false);
        const texto = this.add.text(x, 160, this.nubesTextos[this.nubesApartadas], {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '14px',
            color: '#000000',
            align: 'center',
            fontStyle: 'bold',
            wordWrap: { width: 160 }
        }).setOrigin(0.5).setDepth(56).setVisible(false);

        const checkFlotando = this.time.addEvent({
            delay: 16,
            loop: true,
            callback: () => {
                if (nube.y >= 140) {
                    nube.setVelocityY(0);
                    nube.y = 140;
                    checkFlotando.remove();

                    this.physics.add.overlap(this.playerAitor, nube, () => {
                        if (nube.apartada) return;
                        nube.apartada = true;

                        this.tweens.add({
                            targets: nube,
                            y: -100,
                            alpha: 0,
                            duration: 600,
                            onComplete: () => nube.destroy()
                        });

                        nubePositiva.setVisible(true);
                        texto.setVisible(true);
                        this.nubesApartadas++;

                        this.time.delayedCall(800, () => {
                            this.spawnNubeSiguiente();
                        });
                    }, null, this);
                }
            }
        });
    }

    startFaseAbrazo() {
        this.gameOverActivo = true;

        this.time.delayedCall(2000, () => {
            this.keyla.play('anim_keyla_walk_right');
            this.keyla.setFlipX(true);

            this.tweens.add({
                targets: this.keyla,
                x: this.playerAitor.x + 60,
                duration: 2000,
                onComplete: () => {
                    this.playerAitor.setVisible(false);
                    this.keyla.setVisible(false);

                    const abrazo = this.add.sprite(this.playerAitor.x + 30, 355, 'abrazo')
                        .setOrigin(0.5, 1).setScale(3.5).setDepth(10);
                    abrazo.play('anim_abrazo');

                    this.time.delayedCall(3000, () => {
                        this.mostrarVinyetaFinal();
                    });
                }
            });
        });
    }
    mostrarVinyetaFinal() {
        this.add.rectangle(400, 200, 800, 400, 0x000000, 0.7).setScrollFactor(0).setDepth(60);

        const box = this.add.rectangle(400, 200, 500, 250, 0xffffff).setScrollFactor(0).setDepth(61);
        box.setStrokeStyle(4, 0x000000);

        this.add.text(400, 140, "¡Has conseguido la segunda pieza del puzzle!", {
            fontSize: '20px', color: '#000000', fontStyle: 'bold', align: 'center', wordWrap: { width: 450 }
        }).setOrigin(0.5).setDepth(62);

        this.add.text(400, 200, "Amor 20%", {
            fontSize: '32px', color: '#ff69b4', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(62);

        const btnOk = this.add.rectangle(400, 270, 160, 45, 0xffd700).setInteractive({ useHandCursor: true }).setDepth(62);
        btnOk.setStrokeStyle(2, 0x000000);
        this.add.text(400, 270, "ACEPTAR", {
            fontSize: '22px', color: '#000000', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(63);

        btnOk.on('pointerdown', () => {
            this.scene.start('HubScene', { nivel2Abierto: true, nivel3Abierto: true, desde: 'nivel2' });
        });
    }
}
