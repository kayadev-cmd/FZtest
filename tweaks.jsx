/* FARMZER0 Tweaks panel */
const { useEffect } = React;

function FZTweaks() {
  const [t, setTweak] = useTweaks(window.__TWEAKS);

  // mirror to live page on every change
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", t.accent);
    const strip = document.querySelector(".status-strip");
    if (strip) strip.style.display = t.showLiveStrip ? "" : "none";

    const h1 = document.querySelector(".hero h1");
    if (h1 && t.tagline) {
      const parts = t.tagline.split(".").map(s => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        const a = parts[0].split(" ");
        const b = parts[1].split(" ");
        h1.innerHTML =
          `${a.slice(0, -1).join(" ")} <span class="zero">${a[a.length - 1]}.</span><br/>` +
          `${b.slice(0, -1).join(" ")} <em>${b[b.length - 1]}.</em>`;
      } else {
        h1.textContent = t.tagline;
      }
    }

    document.body.dataset.density = t.density;
  }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Accent">
        <TweakColor
          label="Accent color"
          value={t.accent}
          onChange={v => setTweak("accent", v)}
          options={["#B89968", "#C57B57", "#0E2A20", "#1A1814"]}
        />
      </TweakSection>

      <TweakSection label="Headline">
        <TweakRadio
          label="Tagline"
          value={t.tagline}
          onChange={v => setTweak("tagline", v)}
          options={[
            { value: "Zero miles. Maximum fresh.", label: "Zero miles." },
            { value: "Grown here. Eaten here.",     label: "Grown here." },
            { value: "Your city. Your farm.",       label: "Your city." },
            { value: "Fresh from the Loop.",        label: "Fresh Loop." },
          ]}
        />
      </TweakSection>

      <TweakSection label="Living elements">
        <TweakToggle
          label="Live status strip"
          value={t.showLiveStrip}
          onChange={v => setTweak("showLiveStrip", v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-mount")).render(<FZTweaks />);
