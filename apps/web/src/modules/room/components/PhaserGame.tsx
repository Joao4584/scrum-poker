'use client'

import { useEffect, useRef } from 'react'
import Phaser from 'phaser'

/**
 * Uma cena de exemplo simples para demonstrar a integração.
 */
class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  create() {
    this.add.text(100, 100, 'Phaser + Next.js!', {
      font: '32px Arial',
      color: '#ffffff',
    })
  }
}

/**
 * Um componente React que incorpora um jogo Phaser.
 * Este componente lida com a criação e limpeza da instância do jogo,
 * tornando-o compatível com o ciclo de vida de componentes do Next.js e o hot-reloading.
 */
const PhaserGame = () => {
  // Ref para a div que conterá o jogo
  const gameContainerRef = useRef<HTMLDivElement>(null)
  // Ref para a instância do jogo
  const gameInstanceRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    // Este efeito é executado uma vez quando o componente é montado.
    if (gameInstanceRef.current) {
      // Se uma instância do jogo já existe, não faz nada.
      return
    }

    // Garante que o contêiner está disponível
    if (gameContainerRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameContainerRef.current, // Renderiza o jogo na div referenciada
        backgroundColor: '#1a1a1a',
        scene: [GameScene],
      }

      // Cria uma nova instância do jogo Phaser
      gameInstanceRef.current = new Phaser.Game(config)
    }

    // A função de limpeza é retornada do efeito.
    // Ela será chamada quando o componente for desmontado.
    return () => {
      gameInstanceRef.current?.destroy(true)
      gameInstanceRef.current = null
    }
  }, []) // O array de dependências vazio garante que este efeito seja executado apenas uma vez.

  return <div ref={gameContainerRef} />
}

export default PhaserGame
