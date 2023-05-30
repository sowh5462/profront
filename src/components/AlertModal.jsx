import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { AlertContext } from './AlertContext';

const AlertModal = () => {
    const {box, setBox} = useContext(AlertContext);
    
    const onClose = () => {
        setBox({
            ...box,
            show:false
        })
    }
    const onClickAction = () => {
        box.action();
        setBox({
            ...box, 
            show:false
        });
    }

    return (
        <>
            <Modal show={box.show} onHide={onClose} backdrop="static" className="my-5">
                <Modal.Header closeButton>
                    <Modal.Title>알림</Modal.Title>
                </Modal.Header>
                <Modal.Body>{box.message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        { box.action ? '취소' : '닫기'}
                    </Button>
                    { box.action &&
                        <Button variant="primary" onClick={onClickAction}>
                            확인
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AlertModal