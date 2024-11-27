import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let UpdatedAtText = "Carregando...";

  if (!isLoading && data) {
    UpdatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <div>
      <b>Última atualização:</b> {UpdatedAtText}
    </div>
  );
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseStatusInformation = "Carregando...";

  if (!isLoading && data) {
    databaseStatusInformation = (
      <>
        <div>
          <b>Versão do Postgres: </b> {data.dependencies.database.version}
        </div>
        <div>
          <b>Conexões abertas: </b> {data.dependencies.database.max_connections}
        </div>
        <div>
          <b>Conexõs máximas: </b>
          {data.dependencies.database.opened_connections}
        </div>
      </>
    );
  }

  return (
    <>
      <h2> Database Status </h2>
      <div>{databaseStatusInformation}</div>
    </>
  );
}
