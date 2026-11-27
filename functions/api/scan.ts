export async function onRequest() {
  const picks = [
    { match: "Arsenal vs Chelsea", pick: "HOME WIN", odds: 2.10, confidence: "68%", edge: "+4.2%", reason: "Home form + market value edge" },
    { match: "Man City vs Liverpool", pick: "OVER 2.5", odds: 1.85, confidence: "64%", edge: "+3.1%", reason: "Both teams high xG" },
    { match: "Real Madrid vs Barcelona", pick: "BTTS YES", odds: 1.70, confidence: "71%", edge: "+5.5%", reason: "Both attacks elite, defences vulnerable" }
  ]
  return new Response(JSON.stringify({ picks, generated: new Date().toISOString() }), {
    headers: { "content-type": "application/json" }
  })
}
