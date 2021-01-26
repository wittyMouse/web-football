import React from "react";
import { CaptchaFormData } from "../data";

interface ModalProps {
  visible: boolean;
  captchaSrc: string;
  captchaFormData: CaptchaFormData;
  onCaptchaUpdate: () => void;
  onInput: (e: any) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = (props: ModalProps) => {
  const {
    visible,
    captchaSrc,
    captchaFormData,
    onCaptchaUpdate,
    onInput,
    onSubmit,
    onClose,
  } = props;
  const onFormSubmit = (e: any) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="model" style={{ display: visible ? "block" : "none" }}>
      <div className="model-mask" onClick={onClose}></div>
      <div className="model-inner">
        <form onSubmit={onFormSubmit} autoComplete="off">
          <div className="model-header">
            <h1 className="model-title">验证</h1>
          </div>

          <div className="model-content">
            <div className="modal-form-item">
              <div className="modal-form-label">验证码</div>
              <div className="modal-form-value">
                <input
                  className="model-form-input"
                  name="captcha"
                  value={captchaFormData.captcha}
                  onInput={onInput}
                />
                <img
                  className="model-form-captcha-image"
                  src={captchaSrc}
                  onClick={onCaptchaUpdate}
                />
              </div>
            </div>
          </div>

          <div className="model-footer">
            <button className="model-form-button" type="submit">
              提交
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
