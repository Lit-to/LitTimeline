import Modal from 'react-bootstrap/Modal';
import "./modal.css";

export const Signup = () => {
    const title: string = "アカウントを作る";
    const p_id: string = "id : ";
    const p_password: string = "パスワード : ";

    return (
        <div>
            <span>
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <label>
                                {p_id}
                                <input type="text" name="id" />
                            </label>
                            <label>
                                {p_password}
                                <input type="text" name="password" />
                            </label>
                            <input type="submit" value="Submit" />
                        </form>
                    </Modal.Body>
                </Modal.Dialog>
            </span>

        </div>

    );
}

