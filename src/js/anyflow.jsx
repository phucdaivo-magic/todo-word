import ReactDOM from "react-dom/client";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";


new EventSource("/esbuild").addEventListener("change", () =>
  location.reload(),
);

const TitleComponent = () => {
  return (
    <div className="font-size:50px font-weight:bold text-transform:uppercase">
      Your Brand
      <span className="color:lab(83.7876%_-45.0447_88.4738) margin:0_5px background:#eee display:inline-block padding:0_10px">Deserves</span>
      More Than a Pretty Website.
    </div>
  )
}

const ModalComponent = ({ onClose }) => {
  return (
    <div onClick={onClose} class="position:fixed top:0 left:0 width:100% height:100% background:rgba(0,_0,_0,_0.5) display:flex justify-content:center align-items:center">
      <div class="width:500px height:500px background:#fff padding:10px">
        <h1 className="font-size:20px border-bottom:1px_solid_#eee padding-bottom:10px">Let's Talk</h1>
        <div className="color:#666; font-size:16px">
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
      <div class="color:#666">
        We design immersive, motion-driven websites that command attention
        and guide users to act. Clean builds. Sharp strategy. Zero fluff.
      </div>
      <button data-content="Let's Talk" onClick={() => setIsModalOpen(true)} class="after:content:attr(data-content) box-sizing:border-box hover:background:#fff hover:color:#000 hover:border:1px_solid_lab(83.7876%_-45.0447_88.4738) transition:all_0.3s cursor:pointer font-family:Anton font-weight:500 width:fit-content margin-top:20px background:lab(83.7876%_-45.0447_88.4738) color:#000 padding:10px border-radius:3px border:none">
      </button>

      <Block condition={isModalOpen}>
        <ModalComponent onClose={() => setIsModalOpen(false)} />
      </Block>
    </>
  )
}

const components = {
  TitleComponent: TitleComponent,
  CTActionComponent: CTActionComponent
}

document.querySelectorAll('[data-component]').forEach(element => {
  const componentName = element.getAttribute('data-component');
  if (!componentName) return;
  const Component = components[componentName];
  const root = ReactDOM.createRoot(element);
  root.render(<Component />);
});




