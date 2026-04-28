# Semantic Web RDF Inference Demo

A Java-based application demonstrating **RDF graph construction, ontology modeling, and rule-based inference** using Apache Jena.
The project showcases how **implicit knowledge can be derived from explicit data** using semantic reasoning and queried using SPARQL.

---

## Overview

This project models research papers, authors, methods, and domains as an RDF graph. It combines:

* **Instance data** (`data.ttl`)
* **Ontology/schema definitions** (`ontology.ttl`)
* **Custom inference rules** (`rules.txt`)

Using a rule-based reasoner, the system enriches the graph with **inferred relationships**, enabling higher-level semantic queries.

---

## Architecture

```
data.ttl + ontology.ttl
        ↓
   Base RDF Graph
        ↓
     rules.txt
        ↓
  Inference Engine (Jena)
        ↓
  Enriched RDF Graph
        ↓
   SPARQL Queries
```

---

## Key Features

* **RDF Graph Construction** using Turtle files
* **Ontology-based Modeling** (class hierarchies, property constraints)
* **Rule-Based Inference** using Jena rule engine
* **Automated Query Execution** from `.rq` / `.sparql` files
* Supports:

  * `SELECT`
  * `ASK`
  * `CONSTRUCT`
  * `DESCRIBE`

---

## Project Structure

```
semantic-web-owl/
├── queries/                 # SPARQL query files
│   ├── q1.rq
│   ├── q2.rq
│   └── q3.rq
│
├── src/main/java/org/example/
│   └── Main.java            # Entry point
│
├── data.ttl                # Instance data
├── ontology.ttl            # Ontology/schema
├── rules.txt               # Inference rules
├── pom.xml
└── README.md
```

---

## Data Model

### Core Entities

* **Paper**
* **Author**
* **Method**
* **Domain**

### Relationships

* `hasAuthor`
* `usesMethod`
* `hasDomain`

---

## Ontology Design

The ontology defines hierarchical relationships:

### Method Hierarchy

```
Method
 └── MachineLearningMethod
      └── DeepLearningMethod
```

### Domain Hierarchy

```
Domain
 ├── HealthcareDomain
 ├── GeographyDomain
 └── ComputerScienceDomain
```

---

## Rule-Based Inference

### Rule 1: Author Expertise

If a paper uses a method and has an author:

```
Author → expertIn → Method
```

---

### Rule 2: Expertise Category

If an author is expert in a method:

```
Author → expertInCategory → MethodType
```

---

### Rule 3: Domain Association

If a paper has a domain:

```
Author → worksInDomain → Domain
```

---

## Query Execution

All queries in the `queries/` folder are automatically executed.

### Example Queries

#### 🔹 q1.rq — Author Expertise

```sparql
PREFIX : <http://example.org/>

SELECT ?author ?method WHERE {
  ?author :expertIn ?method .
}
```

#### 🔹 q2.rq — Domain Association

```sparql
PREFIX : <http://example.org/>

SELECT ?author ?domain WHERE {
  ?author :worksInDomain ?domain .
}
```

#### 🔹 q3.rq — Deep Learning Experts

```sparql
PREFIX : <http://example.org/>

SELECT ?author WHERE {
  ?author :expertInCategory :DeepLearningMethod .
}
```

---

## Sample Output

```
=== Executing: q2.rq ===
| author     | domain          |
|------------|-----------------|
| :Bob       | :MedicalImaging |
| :Alice     | :AI             |
| :Siddharth | :RemoteSensing  |

=== Executing: q1.rq ===
| author     | method  |
|------------|---------|
| :Bob       | :ResNet |
| :Alice     | :SVM    |
| :Siddharth | :UNet   |

=== Executing: q3.rq ===
| author     |
|------------|
| :Siddharth |
| :Bob       |
```

---

## How It Works

### Step-by-Step Flow

1. Load RDF data (`data.ttl`)
2. Load ontology (`ontology.ttl`)
3. Load inference rules (`rules.txt`)
4. Apply rule-based reasoning
5. Create enriched RDF graph
6. Execute SPARQL queries

---

## Main Execution Logic

The application:

* Loads models using Jena
* Applies `GenericRuleReasoner`
* Builds an `InfModel`
* Iterates over query files and executes them dynamically

---

## Setup Instructions

### Prerequisites

* Java 17+
* Apache Maven

---

### Fix Java + Maven Configuration (Important)

If you encounter:

```
invalid target release: 17
```

Ensure Maven uses Java 17:

```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
```

Verify:

```bash
mvn -v
```

---

### Build & Run

```bash
mvn clean compile
mvn exec:java -Dexec.mainClass="org.example.Main"
```

---

## Key Design Decisions

### 1. Separation of Concerns

* Data → `data.ttl`
* Schema → `ontology.ttl`
* Logic → `rules.txt`

---

### 2. Instance-Based Modeling

* Methods and domains are modeled as **instances**
* Categories handled via class hierarchy

---

### 3. Rule-Based Reasoning

* Enables deriving **implicit knowledge**
* Keeps logic separate from data

---

### 4. Dynamic Query Execution

* Queries are not hardcoded
* Any `.rq` file can be added and executed

---

## Why This Matters

Without inference:

* Only explicit data is available

With inference:

* Expert relationships are derived
* Domain associations are inferred
* Category-level expertise is computed

👉 This demonstrates the **core value of semantic web technologies**

---

## Future Improvements

* Add RDFS/OWL reasoning support
* Visualize RDF graph
* Add REST API for query execution
* Support query parameters
* Integrate with frontend visualization tools

---

## License

This is a demonstration project for educational purposes.
