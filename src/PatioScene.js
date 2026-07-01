class PatioScene extends Phaser.Scene {
    constructor() {
        super('PatioScene');
    }

    create(data) {
        // Fondo completo (capa 0)
        this.add.image(400, 200, 'fondo_patio').setDisplaySize(800, 400).setDepth(0);

        // Suelo físico con Arcade Physics
        const ground = this.physics.add.staticImage(400, 345, 'suelo_patio');
        ground.setDisplaySize(800, 60).refreshBody();

        // Suelo visual encima del físico (capa 1)
        ground.setDepth(1);

        // Configuración del mundo
        this.physics.world.setBounds(0, 0, 800, 400);

        // Posición inicial del jugador
        const spawnX = (data && data.from === 'StairsScene') ? 750 : 50;

        this.player = this.physics.add.sprite(spawnX, 200, 'aitor_cani_idle');
        this.player.setDisplaySize(190, 190);
        this.player.body.setSize(30, 15);
        this.player.body.setOffset(9, 33);
        this.player.body.setBounce(0.1);
        this.player.body.setCollideWorldBounds(true);
        this.player.setDepth(2);

        // Colisiones
        this.physics.add.collider(this.player, ground);

        // Animaciones
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

        // NPCs
        this.npcs = [];

        // Diego
        this.diego = this.add.sprite(400, 220, 'diego_cani_idle').setDisplaySize(190, 190).setDepth(2);
        this.diego.nombre = "Diego";
        this.diego.mensaje = "¡Hola!";
        if (!this.anims.exists('diego_idle')) {
            this.anims.create({
                key: 'diego_idle',
                frames: this.anims.generateFrameNumbers('diego_cani_idle', { start: 0, end: 3 }),
                frameRate: 3, repeat: -1
            });
        }
        this.diego.play('diego_idle');
        this.npcs.push(this.diego);

        // Chloe
        this.chloe = this.add.sprite(220, 220, 'chloe_idle').setDisplaySize(190, 190).setDepth(2);
        this.chloe.nombre = "Chloe";
        this.chloe.mensaje = "¡Hola!";
        if (!this.anims.exists('chloe_idle')) {
            this.anims.create({
                key: 'chloe_idle',
                frames: this.anims.generateFrameNumbers('chloe_idle', { start: 0, end: 3 }),
                frameRate: 3, repeat: -1
            });
        }
        this.chloe.play('chloe_idle');
        this.npcs.push(this.chloe);

        // Keyla
        this.keyla = this.add.sprite(100, 220, 'keyla_otaku_idle').setDisplaySize(190, 190).setDepth(2);
        this.keyla.nombre = "Keyla";
        this.keyla.mensaje = "¡Hola!";
        if (!this.anims.exists('keyla_otaku_idle')) {
            this.anims.create({
                key: 'keyla_otaku_idle',
                frames: this.anims.generateFrameNumbers('keyla_otaku_idle', { start: 0, end: 3 }),
                frameRate: 3, repeat: -1
            });
        }
        this.keyla.play('keyla_otaku_idle');
        this.npcs.push(this.keyla);

        this.npcCercano = null;
        this.chloeDialogueDone = false;
        this.waitingForOption = false;
        this.dialogoAbierto = false;
        this.faseDialogo = 0;

        // Diálogos
        this.dialogosDiego = [
            { nombre: "Diego", mensaje: "Franco, ¿qué tal?", skinBox: "dialogo_npc" },
            { nombre: "Aitor", mensaje: "Bien bien... ¿pero quién es esa chica que está hablando con Chloé?", skinBox: "dialogo_jugador" },
            { nombre: "Diego", mensaje: "Ah... creo que se llama Keyla. Es la mejor amiga de Chloé. Es un poco rarita, le va el anime y esas cosas.", skinBox: "dialogo_npc" },
            { nombre: "Aitor", mensaje: "Ah, ¿una otaku de esas verdad?", skinBox: "dialogo_jugador" },
            { nombre: "Diego", mensaje: "Sí sí, bueno más o menos... se junta también con Gorka y esta gente. Anda, ve y pregúntale a Chloé si quieres saber más.", skinBox: "dialogo_npc" },
            { nombre: "Aitor", mensaje: "Ahh algo me puede sonar.", skinBox: "dialogo_jugador" }
        ];

        this.dialogosChloe = [
            { nombre: "Chloe", mensaje: "Francoooo ¿cómo estás?", skinBox: "dialogo_npc" },
            { nombre: "Aitor", mensaje: "Bien ¿y tú? Creo que tienes compañía.", skinBox: "dialogo_jugador" },
            { nombre: "Chloe", mensaje: "Sí, es Keyla.", skinBox: "dialogo_npc" },
            { nombre: "Aitor", mensaje: "Me ha dicho Diego que es otaku o algo así.", skinBox: "dialogo_jugador" },
            { nombre: "Chloe", mensaje: "No te creas, tampoco habla demasiado de anime.", skinBox: "dialogo_npc" },
            { nombre: "Aitor", mensaje: "¿Y qué más le gusta?", skinBox: "dialogo_jugador" },
            { nombre: "Chloe", mensaje: "Pues le gusta mucho el rock y esas cosas, ahora está obsesionada con Guns N Roses y Nirvana.", skinBox: "dialogo_npc" },
            { nombre: "Aitor", mensaje: "Mmmm entiendo... ¿y de dónde es?", skinBox: "dialogo_jugador" },
            { nombre: "Chloe", mensaje: "Ah, su familia es de Colombia aunque no tiene mucha relación con ellos. Anda ven que te la presento. ¡Keyla! Este es Franco.", skinBox: "dialogo_npc" }
        ];

        this.dialogosKeyla = [
            { nombre: "Aitor", mensaje: "Hola, soy Franco.", skinBox: "dialogo_jugador" },
            { nombre: "Keyla", mensaje: "Yo Keyla.", skinBox: "dialogo_npc" },
            { nombre: "Keyla", mensaje: "¿Eres repetidor verdad?", skinBox: "dialogo_npc" },
            { nombre: "Aitor", mensaje: "Sí, estoy repitiendo este año.", skinBox: "dialogo_jugador" }
        ];

        this.dialogosKeylaA = [
            { nombre: "Keyla", mensaje: "¿Sí? Me encanta Guns N Roses.", skinBox: "dialogo_npc" },
            { nombre: "Aitor", mensaje: "Muy rockero de tu parte.", skinBox: "dialogo_jugador" },
            { nombre: "Keyla", mensaje: "¿Y a qué clase vas?", skinBox: "dialogo_npc" },
            { nombre: "Aitor", mensaje: "Estoy en la misma clase que Moro y Bea.", skinBox: "dialogo_jugador" },
            { nombre: "Keyla", mensaje: "¿Te llevas con ellos?", skinBox: "dialogo_npc" },
            { nombre: "Aitor", mensaje: "Sí más o menos", skinBox: "dialogo_jugador" },
            { nombre: "Keyla", mensaje: "Qué raro... nunca me han hablado de tí 🥴", skinBox: "dialogo_npc" },
            { nombre: "Keyla", mensaje: "Por cierto, mola mucho el collar, ¿puedo verlo?", skinBox: "dialogo_npc" },
            { nombre: "Keyla", mensaje: "Parecen símbolos mayas...", skinBox: "dialogo_npc", },
            { nombre: "Aitor", mensaje: "¿Sabes leerlos?", skinBox: "dialogo_jugador" },
            { nombre: "Keyla", mensaje: "Sí, fui a un campamento en el que me enseñaron.", skinBox: "dialogo_npc" },
            { nombre: "Keyla", mensaje: "Sí, la verdad que bastante. Oye... ¿me pasas tu número?", skinBox: "dialogo_npc" }
        ];

        this.capaDialogo = this.add.container(0, 0).setVisible(false).setDepth(20).setScrollFactor(0);
        const overlay = this.add.rectangle(400, 200, 800, 400, 0x000000, 0.5);
        this.portraitLeft = this.add.sprite(80, 265, 'diego_cani_idle').setDisplaySize(190, 190);
        this.portraitRight = this.add.sprite(720, 265, 'aitor_cani_idle').setDisplaySize(190, 190).setFlipX(true);
        this.dialogImg = this.add.image(400, 335, 'dialogo_npc').setDisplaySize(500, 100);
        this.dialogNameTxt = this.add.text(175, 298, 'Nombre', { fontFamily: '"Courier New", Courier, monospace', fontSize: '15px', color: '#ffffff', fontStyle: 'bold' });
        this.dialogMsgTxt = this.add.text(230, 315, 'Mensaje', { fontFamily: '"Courier New", Courier, monospace', fontSize: '14px', color: '#000000', fontStyle: 'bold', wordWrap: { width: 340, useAdvancedWrap: true } });
        this.capaDialogo.add([overlay, this.portraitLeft, this.portraitRight, this.dialogImg, this.dialogNameTxt, this.dialogMsgTxt]);

        this.interactText = this.add.text(400, 200, 'Hablar\n(H)', { fontFamily: '"Courier New", Courier, monospace', fontSize: '18px', color: '#000000', fontStyle: 'bold', align: 'center', stroke: '#ffffff', strokeThickness: 2 }).setOrigin(0.5).setVisible(false);
        this.keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    }

    update() {
        if (this.waitingForOption) return;

        if (this.dialogoAbierto) {
            this.player.body.setVelocityX(0);
            this.player.anims.play('cani_idle', true);

            if (Phaser.Input.Keyboard.JustDown(this.keyH)) {
                let currentDialogos = null;
                if (this.npcCercano.nombre === "Diego") currentDialogos = this.dialogosDiego;
                if (this.npcCercano.nombre === "Chloe") currentDialogos = this.dialogosChloe;
                if (this.npcCercano.nombre === "Keyla") {
                    currentDialogos = this.dialogoRama === 'A' ? this.dialogosKeylaA : this.dialogosKeyla;
                }

                if (currentDialogos) {
                    this.faseDialogo++;

                    // Lógica de menús de Keyla (aparecen DESPUÉS de ciertas frases)
                    if (this.npcCercano.nombre === "Keyla") {
                        if (this.faseDialogo === 4 && !this.dialogoRama) {
                            this.mostrarMenuOpciones("¿Entonces eres otaku no?", "Mola mucho la camiseta, ¿te gusta Guns N Roses?", 'B', 'A');
                            return;
                        }
                        if (this.dialogoRama === 'A') {
                            if (this.faseDialogo === 8) {
                                this.mostrarMenuOpciones("No, a ti qué más te da", "Sí claro, échale un vistazo", 'B2', 'A2');
                                return;
                            }
                            if (this.faseDialogo === 11) {
                                this.mostrarMenuOpciones("Vaya panchitada", "Qué interesante", 'B3', 'A3');
                                return;
                            }
                            if (this.faseDialogo === 12) {
                                this.mostrarMenuOpciones("No", "Sí", 'B4', 'A4');
                                return;
                            }
                        }
                    }

                    if (this.faseDialogo < currentDialogos.length) {
                        const fase = currentDialogos[this.faseDialogo];
                        this.dialogNameTxt.setText(fase.nombre);
                        this.dialogMsgTxt.setText(fase.mensaje);
                        this.dialogImg.setTexture(fase.skinBox);
                    } else {
                        // Cerrar diálogo
                        this.dialogoAbierto = false;
                        this.capaDialogo.setVisible(false);
                        this.player.setVisible(true);
                        this.npcs.forEach(npc => npc.setVisible(true));

                        if (this.npcCercano.nombre === "Chloe") {
                            this.chloeDialogueDone = true;
                            this.tweens.add({ targets: this.diego, x: 650, duration: 1500, ease: 'Linear' });
                            this.tweens.add({ targets: this.chloe, x: 600, duration: 1500, ease: 'Linear' });

                            // Restaurar bucle de corazones para Diego y Chloe
                            this.time.addEvent({
                                delay: 800, loop: true,
                                callback: () => {
                                    const heart = this.add.text(625, 200, '💕', { fontSize: '16px' }).setDepth(3);
                                    this.tweens.add({ targets: heart, y: 150, alpha: 0, duration: 1000, onComplete: () => heart.destroy() });
                                }
                            });

                            this.npcs = this.npcs.filter(npc => npc.nombre !== "Diego" && npc.nombre !== "Chloe");
                        }
                        this.faseDialogo = 0;
                        this.dialogoRama = null;
                    }
                } else {
                    this.dialogoAbierto = false;
                    this.capaDialogo.setVisible(false);
                    this.player.setVisible(true);
                    this.npcs.forEach(npc => npc.setVisible(true));
                }
            }
            return;
        }

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
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.setVelocityY(-800);
        }

        this.npcCercano = null;
        let minDist = 80;
        this.npcs.forEach(npc => {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
            if (dist < minDist) { minDist = dist; this.npcCercano = npc; }
        });

        if (this.npcCercano) {
            if (!this.capaDialogo.visible) {
                this.interactText.setVisible(true).setPosition(this.npcCercano.x, this.npcCercano.y - 70);
                this.interactText.setText((this.npcCercano.nombre === "Keyla" && !this.chloeDialogueDone) ? "Habla primero con Chloe" : "Hablar\n(H)");
            }
            if (Phaser.Input.Keyboard.JustDown(this.keyH)) {
                if (this.npcCercano.nombre === "Keyla" && !this.chloeDialogueDone) return;
                this.dialogoAbierto = true;
                this.capaDialogo.setVisible(true);
                this.interactText.setVisible(false);
                this.player.setVisible(false);
                this.npcCercano.setVisible(false);

                if (this.npcCercano.nombre === "Diego") {
                    this.faseDialogo = 0;
                    const fase = this.dialogosDiego[0];
                    this.dialogNameTxt.setText(fase.nombre);
                    this.dialogMsgTxt.setText(fase.mensaje);
                    this.dialogImg.setTexture(fase.skinBox);
                    this.portraitLeft.setTexture('diego_cani_idle');
                    this.portraitRight.setTexture('aitor_cani_idle');
                } else if (this.npcCercano.nombre === "Chloe") {
                    this.faseDialogo = 0;
                    const fase = this.dialogosChloe[0];
                    this.dialogNameTxt.setText(fase.nombre);
                    this.dialogMsgTxt.setText(fase.mensaje);
                    this.dialogImg.setTexture(fase.skinBox);
                    this.portraitLeft.setTexture('chloe_idle');
                    this.portraitRight.setTexture('aitor_cani_idle');
                } else if (this.npcCercano.nombre === "Keyla") {
                    this.faseDialogo = 0;
                    const fase = this.dialogosKeyla[0];
                    this.dialogNameTxt.setText(fase.nombre);
                    this.dialogMsgTxt.setText(fase.mensaje);
                    this.dialogImg.setTexture(fase.skinBox);
                    this.portraitLeft.setTexture('keyla_otaku_idle');
                    this.portraitRight.setTexture('aitor_cani_idle');
                }
            }
        } else {
            this.interactText.setVisible(false);
        }
    }

    mostrarMenuOpciones(opcB, opcA, ramaB, ramaA) {
        this.waitingForOption = true;
        this.portraitLeft.setVisible(true);
        this.portraitRight.setVisible(true);
        const btnA = this.add.rectangle(400, 150, 500, 40, 0x444444).setInteractive({ useHandCursor: true }).setScrollFactor(0).setDepth(25);
        const txtA = this.add.text(400, 150, opcA, { fontSize: '14px', color: '#ffffff' }).setOrigin(0.5).setScrollFactor(0).setDepth(26);
        const btnB = this.add.rectangle(400, 210, 500, 40, 0x444444).setInteractive({ useHandCursor: true }).setScrollFactor(0).setDepth(25);
        const txtB = this.add.text(400, 210, opcB, { fontSize: '14px', color: '#ffffff' }).setOrigin(0.5).setScrollFactor(0).setDepth(26);
        btnA.on('pointerdown', () => { btnA.destroy(); txtA.destroy(); btnB.destroy(); txtB.destroy(); this.elegirOpcionKeyla(ramaA); });
        btnB.on('pointerdown', () => { btnA.destroy(); txtA.destroy(); btnB.destroy(); txtB.destroy(); this.elegirOpcionKeyla(ramaB); });
    }

    elegirOpcionKeyla(opcion) {
        this.waitingForOption = false;
        this.portraitLeft.setVisible(true);
        this.portraitRight.setVisible(true);
        const correctChoices = ['A', 'A2', 'A3', 'A4'];
        if (correctChoices.includes(opcion)) {
            // Animación de corazón y salto para Keyla
            this.tweens.add({ targets: this.keyla, y: this.keyla.y - 20, yoyo: true, duration: 300 });
            const heart = this.add.text(this.keyla.x, this.keyla.y - 80, '💕', { fontSize: '24px' }).setDepth(10);
            this.tweens.add({ targets: heart, y: heart.y - 50, alpha: 0, duration: 1000, onComplete: () => heart.destroy() });

            if (opcion === 'A') {
                this.dialogoRama = 'A'; this.faseDialogo = 0;
                const fase = this.dialogosKeylaA[0];
                this.dialogNameTxt.setText(fase.nombre); this.dialogMsgTxt.setText(fase.mensaje); this.dialogImg.setTexture(fase.skinBox);
            } else if (opcion === 'A2') {
                this.faseDialogo = 8;
                const fase = this.dialogosKeylaA[8];
                this.dialogNameTxt.setText(fase.nombre); this.dialogMsgTxt.setText(fase.mensaje); this.dialogImg.setTexture(fase.skinBox);
            } else if (opcion === 'A3') {
                this.faseDialogo = 11;
                const fase = this.dialogosKeylaA[11];
                this.dialogNameTxt.setText(fase.nombre); this.dialogMsgTxt.setText(fase.mensaje); this.dialogImg.setTexture(fase.skinBox);
            } else if (opcion === 'A4') {
                this.dialogNameTxt.setText("Keyla"); this.dialogMsgTxt.setText("¡Guay! Aquí lo tienes. Por cierto, se te ha caído esto... ¡Hasta luego!");
                this.time.delayedCall(2000, () => { this.capaDialogo.setVisible(false); this.mostrarVinyetaFinal(); });
            }
        } else {
            this.dialogNameTxt.setText("Keyla");
            let mensajeError = "Sí bueno... me tengo que ir.";
            if (opcion === 'B2') mensajeError = "Bueno vale, adiós.";
            if (opcion === 'B3') mensajeError = "Vete a la mierda.";
            if (opcion === 'B4') mensajeError = "Vale, hasta luego.";
            this.dialogMsgTxt.setText(mensajeError);
            this.time.delayedCall(1500, () => this.mostrarVinyetaReintentar());
        }
    }

    mostrarVinyetaFinal() {
        // Overlay oscuro de fondo para centrar la atención
        this.add.rectangle(400, 200, 800, 400, 0x000000, 0.7).setScrollFactor(0).setDepth(40);

        // Cuadro blanco con borde negro
        const box = this.add.rectangle(400, 200, 500, 250, 0xffffff).setScrollFactor(0).setDepth(41);
        box.setStrokeStyle(4, 0x000000);

        this.add.text(400, 140, "¡Has conseguido la primera pieza del puzzle!", {
            fontSize: '20px', color: '#000000', fontStyle: 'bold', align: 'center', wordWrap: { width: 450 }
        }).setOrigin(0.5).setDepth(42);

        this.add.text(400, 200, "Amor 10%", {
            fontSize: '32px', color: '#ff69b4', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(42);

        const btnOk = this.add.rectangle(400, 270, 160, 45, 0xffd700).setInteractive({ useHandCursor: true }).setDepth(42);
        btnOk.setStrokeStyle(2, 0x000000);
        this.add.text(400, 270, "ACEPTAR", {
            fontSize: '22px', color: '#000000', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(43);

        btnOk.on('pointerdown', () => {
            this.scene.start('HubScene', { nivel2Abierto: true, desde: 'nivel1' });
        });
    }

    mostrarVinyetaReintentar() {
        this.add.rectangle(400, 200, 800, 400, 0, 0.8).setScrollFactor(0).setDepth(30);
        this.add.text(400, 180, "¡Vuelve a intentarlo! 🔄", { fontSize: '32px', color: '#ff5e5e', fontStyle: 'bold' }).setOrigin(0.5).setDepth(31);
        const btnReset = this.add.rectangle(400, 250, 200, 50, 0xffffff).setInteractive({ useHandCursor: true }).setDepth(31);
        this.add.text(400, 250, "REINICIAR", { fontSize: '24px', color: '#000000', fontStyle: 'bold' }).setOrigin(0.5).setDepth(32);
        btnReset.on('pointerdown', () => this.scene.restart());
    }
}