"use client";

import { useMemo, useState } from "react";

type Suit = "♠" | "♥" | "♦" | "♣" | "JOKER";
type Card = { suit: Suit; rank: string; label: string };

const suits: Suit[] = ["♠", "♥", "♦", "♣"];
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function createDeck(includeJokers: boolean): Card[] {
  const standardCards = suits.flatMap((suit) =>
    ranks.map((rank) => ({ suit, rank, label: `${suit}${rank}` })),
  );

  return includeJokers
    ? [
        ...standardCards,
        { suit: "JOKER", rank: "小王", label: "小王" },
        { suit: "JOKER", rank: "大王", label: "大王" },
      ]
    : standardCards;
}

function shuffle(cards: Card[]) {
  const shuffled = [...cards];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export default function Home() {
  const [includeJokers, setIncludeJokers] = useState(true);
  const [deck, setDeck] = useState<Card[]>(() => shuffle(createDeck(true)));
  const [hand, setHand] = useState<Card[]>([]);
  const [round, setRound] = useState(0);

  const deckSize = useMemo(
    () => createDeck(includeJokers).length,
    [includeJokers],
  );

  const canDraw = deck.length >= 5;

  function resetDeck(nextIncludeJokers = includeJokers) {
    setDeck(shuffle(createDeck(nextIncludeJokers)));
    setHand([]);
    setRound(0);
  }

  function toggleJokers() {
    const nextValue = !includeJokers;
    setIncludeJokers(nextValue);
    resetDeck(nextValue);
  }

  function drawCards() {
    if (!canDraw) return;

    setHand(deck.slice(0, 5));
    setDeck((currentDeck) => currentDeck.slice(5));
    setRound((currentRound) => currentRound + 1);
  }

  return (
    <main className="app-shell">
      <section className="game-panel" aria-label="扑克牌抽取器">
        <header className="header">
          <div>
            <p className="eyebrow">LUCKY DRAW</p>
            <h1>抽张好牌</h1>
          </div>

          <button
            className="reset-button"
            onClick={() => resetDeck()}
            type="button"
          >
            重新开局
          </button>
        </header>

        <div className="settings">
          <div>
            <p className="setting-title">加入大小王</p>
            <p className="setting-caption">牌堆共 {deckSize} 张</p>
          </div>

          <button
            aria-checked={includeJokers}
            aria-label="是否加入大小王"
            className={`switch ${includeJokers ? "is-on" : ""}`}
            onClick={toggleJokers}
            role="switch"
            type="button"
          >
            <span />
          </button>
        </div>

        <div className="status-row">
          <span>{round ? `第 ${round} 局` : "准备开始"}</span>
          <span>余 {deck.length} 张</span>
        </div>

        <div className="table" aria-live="polite">
          {hand.length ? (
            <div className="cards">
              {hand.map((card, index) => {
                const isRed =
                  card.suit === "♥" ||
                  card.suit === "♦" ||
                  card.rank === "大王";
                const isJoker = card.suit === "JOKER";

                return (
                  <article
                    className={`card ${isRed ? "red" : ""} ${
                      isJoker ? "joker" : ""
                    }`}
                    key={`${card.label}-${index}-${round}`}
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    {isJoker ? (
                      <span className="joker-text">{card.rank}</span>
                    ) : (
                      <>
                        <span className="corner">
                          {card.rank}
                          <small>{card.suit}</small>
                        </span>
                        <span className="suit">{card.suit}</span>
                        <span className="corner bottom">
                          {card.rank}
                          <small>{card.suit}</small>
                        </span>
                      </>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <span>✦</span>
              <p>
                点击下方按钮
                <br />
                揭开今天的手气
              </p>
            </div>
          )}
        </div>

        <button
          className="draw-button"
          disabled={!canDraw}
          onClick={drawCards}
          type="button"
        >
          {canDraw ? "抽取 5 张" : "牌堆不足，请重新开局"}
        </button>

        <p className="hint">每局抽出的牌不会回到牌堆</p>
      </section>
    </main>
  );
}
