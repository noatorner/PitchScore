// Tweaks panel — design-tool UI. State management works; panel UI is hidden in production.
function useTweaks(defaults) {
  const [t, setT] = React.useState(defaults);
  const setTweak = (k, v) => setT(prev => ({ ...prev, [k]: v }));
  return [t, setTweak];
}
function TweaksPanel() { return null; }
function TweakSection() { return null; }
function TweakRadio() { return null; }
function TweakSelect() { return null; }
function TweakColor() { return null; }
Object.assign(window, { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakColor });
