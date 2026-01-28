import ReactDOM from "react-dom/client";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

new EventSource("/esbuild").addEventListener("change", () => location.reload());

const TitleComponent = () => {
  const texts = ["Your Brand", "Deserves", "More Than a Pretty Website."];
  return (
    <>
      <div className="font-size:50px font-weight:bold text-transform:uppercase margin-bottom:100px">
        <>{texts[0]}</>
        <span className="color:--green-color margin:0_5px background:#eee display:inline-block padding:0_10px">
          {texts[1]}
        </span>
        {texts[2]}
      </div>
      <HexagonComponent />
    </>
  );
};

const ModalComponent = ({ onClose }) => {
  return (
    <div
      onClick={onClose}
      className="z:1000 position:fixed top:0 left:0 width:100% height:100% background:rgba(0,_0,_0,_0.5) display:flex justify-content:center align-items:center"
    >
      <div className="width:500px height:500px background:#fff padding:10px">
        <h1 className="font-size:20px border-bottom:1px_solid_#eee padding-bottom:10px">
          Let's Talk
        </h1>
        <div className="color:--text-color font-size:16px">
          We design immersive, motion-driven websites that command attention and
          guide users to act. Clean builds. Sharp strategy. Zero fluff.
        </div>
      </div>
    </div>
  );
};

const Text = ({ children }) => {
  return (
    <span className="display:inline-flex flex-wrap:wrap gap:5px">
      {children.split(" ").map((t, index) => (
        <span
          className="transition:all_1s display:inline-flex"
          style={{
            animation: `text linear infinite 5s ${index * 0.24}s`,
          }}
        >
          {t}
        </span>
      ))}
    </span>
  );
};

const Block = ({ condition, children }) => {
  if (!condition) return null;
  return children;
};

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
        <Text>
          We design immersive, motion-driven websites that command attention and
          guide users to act. Clean builds. Sharp strategy. Zero fluff.
        </Text>
      </div>
      <button
        data-content="Let's Talk"
        onClick={() => setIsModalOpen(true)}
        class="animation:hexagon-item_linear_infinite_2s color:--text-color after:content:attr(data-content) box-sizing:border-box hover:background:#fff hover:color:#000 hover:border:1px_solid_--green-color transition:all_0.3s cursor:pointer font-family:Anton font-weight:500 width:fit-content margin-top:20px background:--green-color padding:10px border-radius:3px border:1px_solid_var(--green-color)"
      ></button>

      <Block condition={isModalOpen}>
        <ModalComponent onClose={() => setIsModalOpen(false)} />
      </Block>
    </>
  );
};

const HexagonItem = ({ isHidden = false, delay = 3 }) => {
  return (
    <div
      style={{
        zIndex: isHidden ? -1 : "unset",
      }}
      className="display:flex justify-content:center align-items:center width:30px height:26px left:-1px position:relative"
    >
      <div
        style={{
          animation: `hexagon-item linear infinite 4s ${delay * 0.3}s`,
        }}
        class="
        min-width:32px height:36px background:#fff clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%) position:relative
        before:position:absolute
        before:inset:0
        before:background:--green-color
        before:content:attr(data-content)
        before:display:block
        before:clip-path:inherit

        after:position:absolute
        after:inset:1px
        after:background:inherit
        after:content:attr(data-content)
        after:display:block
        after:clip-path:inherit"
      ></div>
    </div>
  );
};

const HexagonComponent = () => {
  return (
    <div className="display:flex flex-direction:column gap:0">
      <div className="display:flex">
        <HexagonItem delay={1} isHidden={true} />
        <HexagonItem delay={2} isHidden={true} />
        <HexagonItem delay={3} isHidden={true} />
        <HexagonItem delay={4} isHidden={true} />
        <HexagonItem delay={5} />
      </div>
      <div className="display:flex margin-left:15px">
        <HexagonItem delay={1} isHidden={true} />
        <HexagonItem delay={2} isHidden={true} />
        <HexagonItem delay={3} isHidden={true} />
        <HexagonItem delay={4} />
        <HexagonItem delay={5} />
      </div>
      <div className="display:flex">
        <HexagonItem delay={1} isHidden={true} />
        <HexagonItem delay={2} isHidden={true} />
        <HexagonItem delay={3} />
        <HexagonItem delay={4} />
        <HexagonItem delay={5} isHidden={true} />
      </div>
      <div className="display:flex margin-left:15px">
        <HexagonItem delay={1} />
        <HexagonItem delay={2} />
        <HexagonItem delay={3} />
        <HexagonItem delay={4} />
        <HexagonItem delay={5} />
      </div>
      <div className="display:flex">
        <HexagonItem delay={1} isHidden={true} />
        <HexagonItem delay={2} isHidden={true} />
        <HexagonItem delay={3} />
        <HexagonItem delay={4} />
        <HexagonItem delay={5} isHidden={true} />
      </div>
      <div className="display:flex margin-left:15px">
        <HexagonItem delay={1} isHidden={true} />
        <HexagonItem delay={2} isHidden={true} />
        <HexagonItem delay={3} isHidden={true} />
        <HexagonItem delay={4} />
        <HexagonItem delay={5} />
      </div>
      <div className="display:flex">
        <HexagonItem delay={1} isHidden={true} />
        <HexagonItem delay={2} isHidden={true} />
        <HexagonItem delay={3} isHidden={true} />
        <HexagonItem delay={4} isHidden={true} />
        <HexagonItem delay={5} />
      </div>
    </div>
  );
};

const components = {
  TitleComponent: TitleComponent,
  CTActionComponent: CTActionComponent,
  HexagonComponent: HexagonComponent,
};

document.querySelectorAll("[data-component]").forEach((element) => {
  const componentName = element.getAttribute("data-component");
  if (!componentName) return;
  const Component = components[componentName];
  const root = ReactDOM.createRoot(element);
  root.render(<Component />);
});
