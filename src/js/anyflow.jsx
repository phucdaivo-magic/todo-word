import ReactDOM from "react-dom/client";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";


new EventSource("/esbuild").addEventListener("change", () =>
  location.reload(),
);

const TitleComponent = () => {
  return (
    <>
      <div className="font-size:50px font-weight:bold text-transform:uppercase margin-bottom:100px">
        Your Brand
        <span className="color:--green-color margin:0_5px background:#eee display:inline-block padding:0_10px">Deserves</span>
        More Than a Pretty Website.

      </div >
      <HexagonComponent />
    </>
  )
}

const ModalComponent = ({ onClose }) => {
  return (
    <div onClick={onClose} class="z:1000 position:fixed top:0 left:0 width:100% height:100% background:rgba(0,_0,_0,_0.5) display:flex justify-content:center align-items:center">
      <div class="width:500px height:500px background:#fff padding:10px">
        <h1 className="font-size:20px border-bottom:1px_solid_#eee padding-bottom:10px">Let's Talk</h1>
        <div className="color:--text-color font-size:16px">
          We design immersive, motion-driven websites that command attention and guide users to act. Clean builds. Sharp strategy. Zero fluff.
        </div>
      </div>
    </div>
  )
}

const Block = ({ condition, children }) => {
  if (!condition) return null;
  return children;
}

const CTActionComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  return (
    <>
      <div class="color:--text-color">
        We design immersive, motion-driven websites that command attention
        and guide users to act. Clean builds. Sharp strategy. Zero fluff.
      </div>
      <button
        data-content="Let's Talk"
        onClick={() => setIsModalOpen(true)}
        class="animation:hexagon-item_linear_infinite_2s color:--text-color after:content:attr(data-content) box-sizing:border-box hover:background:#fff hover:color:#000 hover:border:1px_solid_--green-color transition:all_0.3s cursor:pointer font-family:Anton font-weight:500 width:fit-content margin-top:20px background:--green-color padding:10px border-radius:3px border:1px_solid_var(--green-color)">
      </button>

      <Block condition={isModalOpen}>
        <ModalComponent onClose={() => setIsModalOpen(false)} />
      </Block>
    </>
  )
}

const HexagonItem = ({ isHidden = false, delay = 3 }) => {
  return (
    <div style={{
      zIndex: isHidden ? -1 : 1,
    }} className="display:flex justify-content:center align-items:center width:fit-content height:fit-content">
      <div
        style={{
          animation: `hexagon-item linear infinite 4s ${delay * 0.3}s`,
        }}
        class="position:relative
            --size:30px;
            hover:background:var(--green-color)
            cursor:pointer
            width:--size
            height:calc(var(--size)_*_58/100)
            border-left:1px_solid_var(--green-color)
            border-right:1px_solid_var(--green-color)

            before:content:attr(data-content)
            before:position:absolute
            before:inset:0
            before:background:inherit
            before:border-radius:inherit
            before:transform:rotate(60deg)
            before:border-left:1px_solid_var(--green-color)
            before:border-right:1px_solid_var(--green-color)

            after:border-left:1px_solid_var(--green-color)
            after:border-right:1px_solid_var(--green-color)
            after:content:attr(data-content)
            after:position:absolute
            after:inset:0
            after:background:inherit
            after:border-radius:inherit
            after:transform:rotate(-60deg)"></div>
    </div >
  )
}

const HexagonComponent = () => {
  return (
    <div className="display:flex flex-direction:column gap:10px">
      <div className="display:flex gap:1px">
        <HexagonItem delay={1} isHidden={true} />
        <HexagonItem delay={2} isHidden={true} />
        <HexagonItem delay={3} isHidden={true} />
        <HexagonItem delay={4} isHidden={true} />
        <HexagonItem delay={5} />
      </div >
      <div className="display:flex gap:1px margin-left:16px">
        <HexagonItem delay={1} isHidden={true} />
        <HexagonItem delay={2} isHidden={true} />
        <HexagonItem delay={3} isHidden={true} />
        <HexagonItem delay={4} />
        <HexagonItem delay={5} />
      </div >
      <div className="display:flex gap:1px">
        <HexagonItem delay={1} isHidden={true} />
        <HexagonItem delay={2} isHidden={true} />
        <HexagonItem delay={3} />
        <HexagonItem delay={4} />
        <HexagonItem delay={5} isHidden={true} />
      </div >
      <div className="display:flex gap:1px margin-left:16px">
        <HexagonItem delay={1} />
        <HexagonItem delay={2} />
        <HexagonItem delay={3} />
        <HexagonItem delay={4} />
        <HexagonItem delay={5} />
      </div >
      <div className="display:flex gap:1px">
        <HexagonItem delay={1} isHidden={true} />
        <HexagonItem delay={2} isHidden={true} />
        <HexagonItem delay={3} />
        <HexagonItem delay={4} />
        <HexagonItem delay={5} isHidden={true} />
      </div >
      <div className="display:flex gap:1px margin-left:16px">
        <HexagonItem delay={1} isHidden={true} />
        <HexagonItem delay={2} isHidden={true} />
        <HexagonItem delay={3} isHidden={true} />
        <HexagonItem delay={4} />
        <HexagonItem delay={5} />
      </div >
      <div className="display:flex gap:1px">
        <HexagonItem delay={1} isHidden={true} />
        <HexagonItem delay={2} isHidden={true} />
        <HexagonItem delay={3} isHidden={true} />
        <HexagonItem delay={4} isHidden={true} />
        <HexagonItem delay={5} />
      </div >
    </div>
  );
}

const components = {
  TitleComponent: TitleComponent,
  CTActionComponent: CTActionComponent,
  HexagonComponent: HexagonComponent
}

document.querySelectorAll('[data-component]').forEach(element => {
  const componentName = element.getAttribute('data-component');
  if (!componentName) return;
  const Component = components[componentName];
  const root = ReactDOM.createRoot(element);
  root.render(<Component />);
});




