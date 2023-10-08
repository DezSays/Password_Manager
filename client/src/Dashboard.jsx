import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToken } from './Token';
import { Button, Container, Card, ListGroup, Row, Col } from 'react-bootstrap';

const Dashboard = () => {
  const { token, userID } = useToken();
  const [passwords, setPasswords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/users/${userID}/passwords`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          navigate('/login');
        }
      })
      .then(data => {
        if (data) {
          setPasswords(data.map(password => ({ ...password, revealed: false })));
        }
      })
      .catch(error => console.error('Error fetching passwords:', error));
  }, [token]);

  const handleClick = () => {
    navigate('/addpass');
  }

  const toggleReveal = (index) => {
    const updatedPasswords = [...passwords];
    updatedPasswords[index].revealed = !updatedPasswords[index].revealed;
    setPasswords(updatedPasswords);
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Passwords Dashboard</h1>
      {passwords.length > 0 ? (
        passwords.map((password, index) => (
          <Card key={password.password_id} className="mb-3">
            <Card.Body>
              <Row>
                <Col>
                  <strong>Site URL:</strong> {password.site_url}
                </Col>
                <Col>
                  <strong>Username:</strong> {password.username}
                </Col>
                <Col>
                  <strong>Notes:</strong> {password.notes}
                </Col>
                <Col>
                  <strong>Password:</strong>
                  {password.revealed ? (
                    <div>
                      {password.pw}
                      <Button variant="secondary" className="ml-2" onClick={() => toggleReveal(index)}>Hide</Button>
                    </div>
                  ) : (
                    <div>
                      <Button variant="primary" className="ml-2" onClick={() => toggleReveal(index)}>Reveal</Button>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No passwords found for this user.</p>
      )}
      <Button variant="success" className="mt-4" onClick={handleClick}>Take me to add passwords</Button>
    </Container>
  );
};

export default Dashboard;
