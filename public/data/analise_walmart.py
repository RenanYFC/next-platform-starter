import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

print("--- INICIANDO SCRIPT DE ANÁLISE FINAL WALMART ---")

# ==============================================================================
# 1. CARREGAMENTO E LIMPEZA DOS DADOS
# ==============================================================================
print("Etapa 1: Carregando e limpando os dados...")
try:
    # Carregando os 5 arquivos CSV originais
    orders_df = pd.read_csv('p9fJDbyvQZOG0pR5mJHI_orders.csv')
    drivers_df = pd.read_csv('ZrBjADYySY6YJpCS5xM8_drivers_data.csv')
    products_df = pd.read_csv('6etncolNRnueUWjhJpdU_products_data.csv')
    missing_items_df = pd.read_csv('2P9sGZNKQCS1B2UDArRJ_missing_items_data.csv')
    customers_df = pd.read_csv('YvR3oYtSRP60f2jU7pqM_customers_data.csv')

    # Limpeza de cabeçalhos
    orders_df.columns = orders_df.columns.str.strip()
    drivers_df.columns = drivers_df.columns.str.strip()
    products_df.columns = products_df.columns.str.strip()
    missing_items_df.columns = missing_items_df.columns.str.strip()
    customers_df.columns = customers_df.columns.str.strip()
    
    # CORREÇÃO: Renomeando a coluna com erro de digitação
    products_df.rename(columns={'produc_id': 'product_id'}, inplace=True)

    # Limpeza e conversão de tipos
    orders_df['order_amount'] = orders_df['order_amount'].replace({r'\$': '', ',': ''}, regex=True).astype(float)
    products_df['price'] = products_df['price'].replace({r'\$': '', ',': ''}, regex=True).astype(float)
    orders_df['date'] = pd.to_datetime(orders_df['date'])

    print("Dados carregados e limpos com sucesso.")
except FileNotFoundError as e:
    print(f"Erro: Arquivo não encontrado. Verifique se todos os 5 arquivos CSV originais estão na mesma pasta que este script. Detalhe: {e}")
    exit()
except KeyError as e:
    print(f"Erro: Coluna não encontrada no arquivo CSV. Verifique se os nomes das colunas estão corretos. Detalhe: {e}")
    exit()


# ==============================================================================
# 2. ENGENHARIA DE ATRIBUTOS E JUNÇÃO
# ==============================================================================
print("Etapa 2: Realizando engenharia de atributos e junção dos dados...")
orders_df['missing_rate'] = (orders_df['items_missing'] / (orders_df['items_delivered'] + orders_df['items_missing'])).fillna(0)
merged_df = pd.merge(orders_df, drivers_df, on='driver_id', how='left')


# ==============================================================================
# 3. MODELAGEM (CLUSTERIZAÇÃO E DETECÇÃO DE OUTLIERS)
# ==============================================================================
print("Etapa 3: Executando a modelagem (Clusterização e Outliers)...")
# Preparando dados para o modelo
driver_model_df = merged_df.groupby(['driver_id', 'driver_name']).agg(
    average_missing_rate=('missing_rate', 'mean'),
    average_order_amount=('order_amount', 'mean'),
    total_trips=('Trips', 'first'),
    driver_age=('age', 'first')
).reset_index().dropna()

# Clusterização
features = ['average_missing_rate', 'average_order_amount', 'total_trips', 'driver_age']
X = driver_model_df[features]
X_scaled = StandardScaler().fit_transform(X)
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
driver_model_df['cluster'] = kmeans.fit_predict(X_scaled)

# Detecção de Outliers
mean_rate = driver_model_df['average_missing_rate'].mean()
std_rate = driver_model_df['average_missing_rate'].std()
outlier_threshold = mean_rate + (3 * std_rate)
outlier_drivers = driver_model_df[driver_model_df['average_missing_rate'] > outlier_threshold]

print("Modelagem concluída.")


# ==============================================================================
# 4. SALVANDO ARQUIVOS DE DADOS (CSVs)
# ==============================================================================
print("Etapa 4: Salvando os arquivos de dados finais...")
driver_model_df.to_csv('driver_analysis_with_clusters.csv', index=False)
print(" -> Salvo: 'driver_analysis_with_clusters.csv'")
outlier_drivers.to_csv('outlier_drivers.csv', index=False)
print(" -> Salvo: 'outlier_drivers.csv'")


# ==============================================================================
# 5. GERANDO GRÁFICOS PARA O DASHBOARD (PNGs)
# ==============================================================================
print("Etapa 5: Gerando os gráficos finais para o dashboard...")
sns.set_style("whitegrid")

# Gráfico 1: Ranking de Motoristas
top_15_drivers = driver_model_df.sort_values(by='average_missing_rate', ascending=False).head(15)
plt.figure(figsize=(12, 8))
sns.barplot(data=top_15_drivers, x='average_missing_rate', y='driver_name', hue='driver_name', palette='viridis', legend=False)
plt.title('Dashboard: Top 15 Motoristas por Taxa Média de Itens Faltantes')
plt.xlabel('Taxa Média de Itens Faltantes')
plt.ylabel('Nome do Motorista')
plt.tight_layout()
plt.savefig('dashboard_driver_ranking.png')
print(" -> Gráfico Salvo: 'dashboard_driver_ranking.png'")
plt.close()

# Gráfico 2: Visualização dos Clusters
plt.figure(figsize=(12, 8))
sns.scatterplot(data=driver_model_df, x='total_trips', y='average_missing_rate', hue='cluster', size='average_order_amount', palette='viridis', sizes=(50, 500))
plt.title('Dashboard: Visualização dos Clusters de Risco de Motoristas')
plt.xlabel('Total de Viagens')
plt.ylabel('Taxa Média de Itens Faltantes')
plt.legend(title='Cluster de Risco')
plt.tight_layout()
plt.savefig('dashboard_cluster_visualization.png')
print(" -> Gráfico Salvo: 'dashboard_cluster_visualization.png'")
plt.close()

# Gráfico 3: Categorias de Produtos
missing_items_long = missing_items_df.melt(id_vars=['order_id'], value_vars=['product_id_1', 'product_id_2', 'product_id_3'], value_name='product_id').dropna()
missing_products_details = pd.merge(missing_items_long, products_df, on='product_id', how='left')
# CORREÇÃO: Usando 'category' em minúsculo
top_missing_categories = missing_products_details['category'].value_counts().nlargest(10)
plt.figure(figsize=(12, 8))
top_missing_categories.sort_values().plot(kind='barh', color=sns.color_palette("mako"))
plt.title('Dashboard: Top 10 Categorias de Produtos Mais Faltantes')
plt.xlabel('Número de Ocorrências')
plt.ylabel('Categoria')
plt.tight_layout()
plt.savefig('dashboard_top_missing_categories.png')
print(" -> Gráfico Salvo: 'dashboard_top_missing_categories.png'")
plt.close()

# Gráfico 4: Regiões
region_analysis = merged_df.groupby('region')['items_missing'].sum().sort_values(ascending=False).head(10)
plt.figure(figsize=(12, 8))
region_analysis.sort_values().plot(kind='barh', color=sns.color_palette("crest"))
plt.title('Dashboard: Top 10 Regiões por Total de Itens Faltantes')
plt.xlabel('Total de Itens Faltantes')
plt.ylabel('Região')
plt.tight_layout()
plt.savefig('dashboard_missing_items_by_region.png')
print(" -> Gráfico Salvo: 'dashboard_missing_items_by_region.png'")
plt.close()

print("\n--- SCRIPT FINALIZADO COM SUCESSO ---")
print("Todos os 6 arquivos foram salvos no seu diretório.")