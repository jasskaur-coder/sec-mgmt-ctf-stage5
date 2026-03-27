# 🚩 CSC NITJ CTF: The Broken Vault

Welcome to **The Broken Vault**, a custom-built web exploitation challenge designed for the Cyber Security Club. This CTF tests participants on real-world misconfigurations in modern web stacks, requiring a chain of vulnerabilities to extract the final flag.

## 🧠 Concepts Covered
This challenge bridges the gap between basic textbook flaws and actual penetration testing. Participants will learn to exploit:
1. **Information Disclosure:** Analyzing HTTP headers and public key infrastructure.
2. **JWT Algorithm Confusion (CVE-like):** Forging administrative tokens by exploiting a missing `kid` validation and forcing an asymmetric key to be evaluated symmetrically (`RS256` -> `HS256`).
3. **Recursive Path Traversal:** Bypassing shallow regex filters (`.replace('../', '')`) in a GraphQL API to access restricted file systems.

## 🛠️ Tech Stack
* **Backend:** Node.js, Express, Apollo GraphQL
* **Frontend:** React (Mocked LocalStorage Sessions)
* **Infrastructure:** Docker (Hardened non-root container)

---

## 🚀 How to Run the Challenge

The infrastructure is fully Dockerized for easy deployment. You do not need Node.js installed locally to run this challenge.

### Prerequisites
* [Docker](https://docs.docker.com/get-docker/) installed on your machine.

### Build and Run (Single Container Backend)
1. Clone the repository:
   ```bash
   git clone [https://github.com/your-repo/csc-ctf-broken-vault.git](https://github.com/your-repo/csc-ctf-broken-vault.git)
   cd csc-ctf-broken-vault/backend
