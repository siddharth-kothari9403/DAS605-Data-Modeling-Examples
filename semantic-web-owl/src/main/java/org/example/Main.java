package org.example;

import org.apache.jena.rdf.model.*;
import org.apache.jena.reasoner.*;
import org.apache.jena.reasoner.rulesys.*;
import org.apache.jena.query.*;

import java.io.*;
import java.nio.file.*;
import java.util.List;

public class Main {

    public static void main(String[] args) throws IOException {

        // Load base model
        Model baseModel = ModelFactory.createDefaultModel();
        baseModel.read("data.ttl");
        baseModel.read("ontology.ttl");

        // Load rules
        List<Rule> rules = Rule.rulesFromURL("rules.txt");
        Reasoner reasoner = new GenericRuleReasoner(rules);

        InfModel infModel = ModelFactory.createInfModel(reasoner, baseModel);

        // Directory containing SPARQL queries
        String queryDir = "queries";

        Files.list(Paths.get(queryDir))
                .filter(path -> path.toString().endsWith(".rq") || path.toString().endsWith(".sparql"))
                .forEach(path -> executeQuery(path, infModel));
    }

    private static void executeQuery(Path path, Model model) {
        System.out.println("\n=== Executing: " + path.getFileName() + " ===");

        try {
            String queryStr = Files.readString(path);

            Query query = QueryFactory.create(queryStr);
            QueryExecution qexec = QueryExecutionFactory.create(query, model);

            if (query.isSelectType()) {
                ResultSet results = qexec.execSelect();
                ResultSetFormatter.out(System.out, results, query);
            } else if (query.isAskType()) {
                boolean result = qexec.execAsk();
                System.out.println("ASK Result: " + result);
            } else if (query.isConstructType()) {
                Model resultModel = qexec.execConstruct();
                resultModel.write(System.out, "TTL");
            } else if (query.isDescribeType()) {
                Model resultModel = qexec.execDescribe();
                resultModel.write(System.out, "TTL");
            }

            qexec.close();

        } catch (Exception e) {
            System.err.println("Error executing query: " + path.getFileName());
            e.printStackTrace();
        }
    }
}