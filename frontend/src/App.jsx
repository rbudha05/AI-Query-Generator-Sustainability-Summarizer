import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
  Card,
  Badge,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [mode, setMode] = useState("query");

  const [query, setQuery] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [articleText, setArticleText] = useState("");

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse("");
    setError("");
    setLoading(true);

    try {
      let res;

      if (mode === "query") {
        if (!query.trim()) {
          setError("Please enter a query.");
          setLoading(false);
          return;
        }

        res = await axios.post("http://localhost:3000/api/query", {
          query,
        });

        setResponse(res.data.response || res.data.result || "No response generated.");
      } else {
        if (!articleText.trim()) {
          setError("Please paste the article text.");
          setLoading(false);
          return;
        }

        res = await axios.post("http://localhost:3000/api/summarize", {
          articleTitle,
          articleText,
        });

        setResponse(res.data.result || res.data.response || "No summary generated.");
      }
    } catch (err) {
      console.error("Frontend error:", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.details ||
          "Failed to fetch response. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
    setResponse("");
    setError("");
    setQuery("");
    setArticleTitle("");
    setArticleText("");
  };

  const handleClear = () => {
    setResponse("");
    setError("");

    if (mode === "query") {
      setQuery("");
    } else {
      setArticleTitle("");
      setArticleText("");
    }
  };

  const currentCharCount = mode === "query" ? query.length : articleText.length;

  return (
    <div className="app-page">
      <div className="bg-orb orb-one"></div>
      <div className="bg-orb orb-two"></div>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={11} lg={9} xl={8}>
            <Card className="app-card border-0 rounded-4 overflow-hidden">
              <div className="app-card-topbar"></div>

              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <Badge className="app-badge mb-3">AI-Powered Lab Tool</Badge>

                  <h1 className="app-title">
                    AI Query Generator & Sustainability Summarizer
                  </h1>

                  <p className="app-subtitle mx-auto">
                    Ask a general AI question or generate a sustainability-focused
                    summary and analysis from a real article for your lab assignment.
                  </p>
                </div>

                <Card className="mode-card border-0 mb-4">
                  <Card.Body className="p-3 p-md-4">
                    <Row className="align-items-center g-3">
                      <Col md={6}>
                        <Form.Group controlId="modeSelect">
                          <Form.Label className="section-label mb-2">
                            Select Mode
                          </Form.Label>
                          <Form.Select
                            className="custom-input"
                            value={mode}
                            onChange={(e) => handleModeChange(e.target.value)}
                          >
                            <option value="query">AI Query</option>
                            <option value="summarize">Article Summarizer</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <div className="mode-info-box">
                          <div className="mode-info-title">
                            {mode === "query" ? "AI Query Mode" : "Article Summarizer Mode"}
                          </div>
                          <div className="mode-info-text">
                            {mode === "query"
                              ? "Use this to ask a direct question and receive an AI-generated response."
                              : "Use this to paste an article and generate a sustainability summary and analysis."}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Form onSubmit={handleSubmit}>
                  {mode === "query" && (
                    <Card className="content-card border-0 mb-4">
                      <Card.Body className="p-3 p-md-4">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                          <Form.Label className="section-label mb-0" htmlFor="queryInput">
                            Enter the Query
                          </Form.Label>
                          <span className="char-counter">
                            {currentCharCount} characters
                          </span>
                        </div>

                        <Form.Control
                          id="queryInput"
                          className="custom-textarea"
                          as="textarea"
                          rows={7}
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Type your query here..."
                          required
                        />

                        <div className="helper-text mt-2">
                          Example: What are sustainable solutions provided by major software companies?
                        </div>
                      </Card.Body>
                    </Card>
                  )}

                  {mode === "summarize" && (
                    <Card className="content-card border-0 mb-4">
                      <Card.Body className="p-3 p-md-4">
                        <Form.Group className="mb-3" controlId="articleTitleInput">
                          <Form.Label className="section-label">Article Title</Form.Label>
                          <Form.Control
                            className="custom-input"
                            type="text"
                            value={articleTitle}
                            onChange={(e) => setArticleTitle(e.target.value)}
                            placeholder="Enter article title..."
                          />
                        </Form.Group>

                        <Form.Group controlId="articleTextInput">
                          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                            <Form.Label className="section-label mb-0">
                              Article Text
                            </Form.Label>
                            <span className="char-counter">
                              {currentCharCount} characters
                            </span>
                          </div>

                          <Form.Control
                            className="custom-textarea"
                            as="textarea"
                            rows={12}
                            value={articleText}
                            onChange={(e) => setArticleText(e.target.value)}
                            placeholder="Paste the full article text here..."
                            required
                          />
                        </Form.Group>

                        <div className="helper-text mt-2">
                          Paste a full article or a strong article excerpt for better results.
                        </div>
                      </Card.Body>
                    </Card>
                  )}

                  <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                    <Button
                      type="submit"
                      disabled={loading}
                      className={`action-btn px-4 py-2 ${
                        mode === "query" ? "query-btn" : "summary-btn"
                      }`}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          {mode === "query" ? "Submitting..." : "Generating..."}
                        </>
                      ) : mode === "query" ? (
                        "Submit Query"
                      ) : (
                        "Generate Summary"
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline-light"
                      className="clear-btn px-4 py-2"
                      onClick={handleClear}
                      disabled={loading}
                    >
                      Clear
                    </Button>
                  </div>
                </Form>

                {error && (
                  <Alert variant="danger" className="mt-4 custom-alert">
                    {error}
                  </Alert>
                )}

                <Card className="result-card border-0 mt-4">
                  <Card.Body className="p-3 p-md-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                      <div>
                        <h4 className="result-title mb-1">Results</h4>
                        <p className="result-subtitle mb-0">
                          {mode === "query"
                            ? "Your AI query response will appear below."
                            : "Your generated sustainability summary and analysis will appear below."}
                        </p>
                      </div>

                      {response && (
                        <Button
                          type="button"
                          variant="outline-light"
                          size="sm"
                          className="copy-btn"
                          onClick={() => navigator.clipboard.writeText(response)}
                        >
                          Copy Output
                        </Button>
                      )}
                    </div>

                    {loading ? (
                      <div className="loading-box">
                        <Spinner animation="border" variant="light" />
                        <p className="mb-0 mt-3">
                          {mode === "query"
                            ? "Generating AI response..."
                            : "Analyzing article and generating summary..."}
                        </p>
                      </div>
                    ) : response ? (
                      <Form.Group controlId="responseOutput">
                        <Form.Control
                          className="result-textarea"
                          as="textarea"
                          rows={14}
                          value={response}
                          readOnly
                        />
                      </Form.Group>
                    ) : (
                      <div className="empty-state">
                        No result yet. Submit a query or paste an article to generate output.
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;