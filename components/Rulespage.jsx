"use client";

import React, { useEffect, useState } from 'react'

function Seal() {
  return (
    <svg
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23 3 L41 10 V22 C41 33 33 40 23 43 C13 40 5 33 5 22 V10 Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />

      <path
        d="M23 9 L35 14 V22 C35 30 29 35 23 37 C17 35 11 30 11 22 V14 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  )
}

export default function RulePage() {
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch(
          'https://api.semaphore2k26.in/api/teamrules'
        )

        if (!response.ok) {
          throw new Error('Failed to fetch team rules')
        }

        const result = await response.json()

        console.log('Team Rules API Response:', result)

        if (
          result.success &&
          result.data &&
          Array.isArray(result.data.rules)
        ) {
          setRules(result.data.rules)
        } else {
          throw new Error('Invalid rules data received from server')
        }
      } catch (err) {
        console.error('Error fetching team rules:', err)
        setError('Unable to load rules. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchRules()
  }, [])

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Cormorant+Garamond:wght@400;600&family=Space+Mono:wght@400;700&display=swap");

        :root {
          --deep: #0c1b2b;
          --deep-2: #12202f;
          --steel: #2c3d4f;
          --ocean: #0d5a92;
          --ocean-mid: #3a7cb8;
          --ocean-deep: #0d3f68;
          --glow: #bff0f5;
          --parchment: #e8f4f8;
          --parchment-2: #d6e9f2;
          --ink: #10202e;
          --rule-num: #0d5a92;
        }

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
        }

        body {
          font-family: "Cormorant Garamond", serif;
        }

        .ocean {
          min-height: 100vh;
          padding: 56px 16px;

          background:
            linear-gradient(
              180deg,
              #9ed5f5 0%,
              #4a8dc9 45%,
              #0f3660 100%
            );

          font-family: "Cormorant Garamond", serif;
        }

        .scroll-wrap {
          max-width: 760px;
          margin: 0 auto;
        }

        .roll {
          height: 26px;
          border-radius: 999px;

          background:
            linear-gradient(
              180deg,
              #d5e8f5 0%,
              var(--parchment) 35%,
              #bcd9ee 100%
            );

          box-shadow:
            0 8px 18px -8px
            rgba(15, 54, 96, 0.5);
        }

        .sheet {
          padding: 56px 48px;

          color: var(--ink);

          background:
            linear-gradient(
              180deg,
              var(--parchment),
              #e8f4fb 50%,
              var(--parchment)
            );

          box-shadow:
            0 30px 70px -20px
            rgba(15, 54, 96, 0.55);
        }

        .sheet-head {
          text-align: center;
        }

        .kicker {
          font-family: "Space Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--ocean-mid);
        }

        .crest {
          width: 80px;
          height: 80px;

          margin: 0 auto 28px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid
            rgba(58, 124, 184, 0.4);

          border-radius: 50%;

          background:
            rgba(220, 236, 248, 0.5);

          color: var(--ocean-deep);
        }

        .crest svg {
          width: 44px;
          height: 44px;
        }

        .title {
          margin: 12px 0 0;

          font-family: "Cinzel", serif;

          font-size: clamp(30px, 5vw, 46px);

          font-weight: 700;

          letter-spacing: 0.03em;

          color: var(--ocean-deep);
        }

        .title::after {
          content: "";

          display: block;

          width: 112px;
          height: 2px;

          margin: 12px auto 0;

          background:
            linear-gradient(
              90deg,
              transparent,
              var(--ocean-mid),
              transparent
            );
        }

        .lede {
          margin-top: 20px;

          text-align: center;

          font-size: 19px;

          color: rgba(28, 66, 102, 0.8);
        }

        .rules {
          list-style: none;

          margin: 48px 0 0;

          padding: 0;
        }

        .rules li {
          display: flex;

          gap: 18px;

          margin-bottom: 28px;

          align-items: flex-start;
        }

        .rules p {
          margin: 0;

          font-size: 20px;

          line-height: 1.6;

          color: var(--ink);
        }

        .num {
          flex: 0 0 32px;

          width: 32px;
          height: 32px;

          margin-top: 4px;

          display: flex;

          align-items: center;
          justify-content: center;

          font-family: "Cinzel", serif;

          font-size: 13px;

          font-weight: 600;

          color: var(--ocean-deep);

          border:
            1px solid
            rgba(58, 124, 184, 0.4);

          border-radius: 50%;

          background:
            rgba(220, 236, 248, 0.6);
        }

        .sheet-foot {
          margin-top: 56px;

          padding-top: 32px;

          text-align: center;

          border-top:
            1px solid
            rgba(58, 124, 184, 0.25);

          color: rgba(28, 66, 102, 0.8);
        }

        .seal {
          font-family: "Cinzel", serif;

          font-size: 16px;

          color: var(--ocean-deep);

          margin: 0 0 8px;
        }

        .error {
          color: #a33a3a;
        }

        @media (max-width: 640px) {
          .ocean {
            padding: 32px 12px;
          }

          .sheet {
            padding: 40px 22px;
          }

          .rules p {
            font-size: 18px;
          }

          .rules li {
            gap: 14px;
            margin-bottom: 22px;
          }

          .num {
            flex: 0 0 30px;
            width: 30px;
            height: 30px;
          }
        }
      `}</style>

      <div className="ocean">
        <div className="scroll-wrap">

          <div className="roll" />

          <div className="sheet">

            {/* HEADER */}
            <div className="sheet-head">

              <div className="crest">
                <Seal />
              </div>

              <h1 className="title">
                Semaphore 2K26
              </h1>

            </div>

            {/* LOADING */}
            {loading && (
              <div className="lede">
                Loading rules...
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div className="lede error">
                {error}
              </div>
            )}

            {/* RULES ONLY */}
            {!loading &&
              !error &&
              rules.length > 0 && (
                <ol className="rules">
                  {rules.map((rule, index) => (
                    <li key={index}>

                      <span className="num">
                        {index + 1}
                      </span>

                      <p>
                        {rule}
                      </p>

                    </li>
                  ))}
                </ol>
              )}

            {/* NO RULES */}
            {!loading &&
              !error &&
              rules.length === 0 && (
                <div className="lede">
                  No rules available.
                </div>
              )}

            {/* FOOTER */}
            <div className="sheet-foot">
              <p className="seal">
                Semaphore 2K26
              </p>

              <p>
                National Level MCA Tech Fest · NMAMIT Nitte
              </p>
            </div>

          </div>

          <div className="roll" />

        </div>
      </div>
    </>
  )
}