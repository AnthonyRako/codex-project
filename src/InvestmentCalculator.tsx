import React, { useState } from 'react';

interface InvestmentData {
  kaufpreis: number;
  wohnflaeche: number;
  kaltmiete: number;
  hausgeldNichtUmlagefaehig: number;
  instandhaltungKostenProM2: number;
  eigenkapitalquote: number;
  zinssatz: number;
  tilgung: number;
  steuersatz: number;
}

const InvestmentCalculator: React.FC = () => {
  const [data, setData] = useState<InvestmentData>({
    kaufpreis: 150000,
    wohnflaeche: 60,
    kaltmiete: 600,
    hausgeldNichtUmlagefaehig: 100,
    instandhaltungKostenProM2: 10,
    eigenkapitalquote: 0.2,
    zinssatz: 0.035,
    tilgung: 0.02,
    steuersatz: 0.3,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: parseFloat(e.target.value),
    });
  };

  const berechneErgebnisse = () => {
    const jahresmiete = data.kaltmiete * 12;
    const bruttorendite = (jahresmiete / data.kaufpreis) * 100;

    const hausgeldJahr = data.hausgeldNichtUmlagefaehig * 12;
    const instandhaltungJahr = data.wohnflaeche * data.instandhaltungKostenProM2;
    const nettomiete = jahresmiete - hausgeldJahr - instandhaltungJahr;

    const gesamtkosten = data.kaufpreis * 1.1; // ca. 10% Nebenkosten
    const nettoRendite = (nettomiete / gesamtkosten) * 100;

    const fremdkapital = data.kaufpreis * (1 - data.eigenkapitalquote);
    const jahresrate = fremdkapital * (data.zinssatz + data.tilgung);

    const cashflowVorSteuer = nettomiete - jahresrate;

    const abschreibung = data.kaufpreis * 0.02 + data.kaufpreis * 0.6 * 0.09;
    const steuerersparnis = abschreibung * data.steuersatz;
    const cashflowNachSteuer = cashflowVorSteuer + steuerersparnis;

    const eingesetztesEK = gesamtkosten * data.eigenkapitalquote;
    const eigenkapitalrendite = (cashflowNachSteuer / eingesetztesEK) * 100;

    return {
      bruttorendite: bruttorendite.toFixed(2),
      nettoRendite: nettoRendite.toFixed(2),
      cashflowVorSteuer: cashflowVorSteuer.toFixed(2),
      cashflowNachSteuer: cashflowNachSteuer.toFixed(2),
      eigenkapitalrendite: eigenkapitalrendite.toFixed(2),
    };
  };

  const ergebnisse = berechneErgebnisse();

  return (
    <div style={{ padding: '20px' }}>
      <h2>Immobilien-Investment Rechner</h2>
      <form>
        {Object.keys(data).map((key) => (
          <div key={key}>
            <label>
              {key}:
              <input
                type="number"
                name={key}
                value={data[key as keyof InvestmentData]}
                onChange={handleChange}
                step="0.01"
              />
            </label>
          </div>
        ))}
      </form>

      <h3>Ergebnisse:</h3>
      <ul>
        <li>Bruttorendite: {ergebnisse.bruttorendite} %</li>
        <li>Netto-Rendite: {ergebnisse.nettoRendite} %</li>
        <li>Cashflow vor Steuer: {ergebnisse.cashflowVorSteuer} EUR</li>
        <li>Cashflow nach Steuer: {ergebnisse.cashflowNachSteuer} EUR</li>
        <li>Eigenkapitalrendite: {ergebnisse.eigenkapitalrendite} %</li>
      </ul>
    </div>
  );
};

export default InvestmentCalculator;
