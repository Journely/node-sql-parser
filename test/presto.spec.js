const { expect } = require("chai");
const Parser = require("../src/parser").default;

describe("Presto", () => {
  const parser = new Parser();
  const opt = {
    database: "presto",
  };

  function getParsedSql(sql, opt) {
    const ast = parser.astify(sql, opt);
    return parser.sqlify(ast, opt);
  }

  it("should support colume start with number", () => {
    const sql = `SELECT min(salary)
    FROM "MyTable" as ST
    WHERE (ST.3_year_base_employee_count= 390)
    GROUP BY ST.bankruptcy_date,ST.3_year_base_employee_count`;
    const ast = parser.astify(sql, opt);
    const backSQL = parser.sqlify(ast, opt);
    expect(backSQL).to.be.equal(
      "SELECT MIN(salary) FROM MyTable AS ST WHERE (ST.3_year_base_employee_count = 390) GROUP BY ST.bankruptcy_date, ST.3_year_base_employee_count"
    );
  });

  it("should cast to REAL", () => {
    const sql = `SELECT CAST (1 AS REAL) FROM "MyTable" as ST`;
    const ast = parser.astify(sql, opt);
    const backSQL = parser.sqlify(ast, opt);
    expect(backSQL).to.be.equal("SELECT CAST(1 AS REAL) FROM MyTable AS ST");
  });

  it("should support CURRENT_DATE", () => {
    const sql = `SELECT current_date as reportDate`;
    const ast = parser.astify(sql, opt);
    const backSQL = parser.sqlify(ast, opt);
    expect(backSQL).to.be.equal("SELECT CURRENT_DATE AS reportDate");
  });
});
