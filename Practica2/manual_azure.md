# MANUAL Tecnico para la configuración de azure para la practica 2:

## **1. Introducción**

Este documento describe el procedimiento detallado para la creación de una infraestructura básica en Microsoft Azure, orientada al despliegue de aplicaciones backend distribuidas en múltiples máquinas virtuales. La arquitectura incluye:

* Agrupación lógica de recursos
* Red virtual privada
* Control de tráfico mediante reglas de seguridad
* Despliegue de máquinas virtuales
* Balanceo de carga

El objetivo es establecer una base funcional y escalable para aplicaciones backend (Node.js y Python) accesibles públicamente.

---

## **2. Creación del Resource Group**

### **2.1 Definición**

Un **Resource Group** es un contenedor lógico que permite organizar y administrar recursos relacionados dentro de Azure. Facilita:

* Control de acceso
* Facturación agrupada
* Eliminación conjunta de recursos
* Gestión por entornos (desarrollo, pruebas, producción)

### **2.2 Procedimiento**

1. Acceder al portal de Azure.
2. Buscar el servicio **Resource groups**.
3. Seleccionar **Create**.

![Resource groups](./images/pr2-azure/2_Resource_groups.png)

### **2.3 Configuración**

* **Subscription:** Seleccionar la suscripción activa.
* **Resource group name:**

  ```
  rg-practica2
  ```
* **Region:** Seleccionar una región consistente (por ejemplo: East US o Central US).

### **2.4 Consideraciones**

Todos los recursos posteriores deben crearse dentro de este grupo y en la misma región para evitar latencias y costos adicionales, al final de la practica este recurso mantendrá todos estos servicios:

![Resource groups](./images/pr2-azure/2_Resource_groups2.png)


---

## **3. Creación de la Virtual Network (VNet)**

### **3.1 Definición**

Una **Virtual Network (VNet)** permite crear una red privada en la nube, similar a una red local tradicional. Es fundamental para:

* Comunicación interna entre recursos
* Segmentación de servicios mediante subredes
* Control de tráfico

### **3.2 Procedimiento**

1. Buscar **Virtual networks**.
2. Seleccionar **Create**.

![](./images/pr2-azure/3_vnet.png)

---

### **3.3 Configuración**

#### **Pestaña: Basics**

* **Resource group:** `rg-practica2`
* **Name:**

  ```
  vnet-practica2
  ```
* **Region:** Igual a la del Resource Group

![](./images/pr2-azure/3_Virtual%20Network%20(VNet).png)

---

#### **Pestaña: IP Addresses**

* **Espacio de direcciones IPv4:**

  ```
  10.0.0.0/16
  ```

Este rango permite hasta 65,536 direcciones IP internas.

---

#### **Subred**

* **Subnet name:**

  ```
  subnet-backend
  ```
* **Subnet address range:**

  ```
  10.0.1.0/24
  ```

Esto limita la subred a 256 direcciones IP, suficiente para este entorno.

---

### **3.4 Consideraciones**

* Las subredes permiten segmentar servicios (por ejemplo: backend, base de datos, frontend).
* Todos los recursos dentro de la VNet pueden comunicarse internamente sin pasar por internet.

![](./images/pr2-azure/3_vnet_deplyment.png)

---

## **4. Network Security Group (NSG)**

### **4.1 Definición**

Un **Network Security Group (NSG)** actúa como un firewall que controla el tráfico de entrada y salida hacia los recursos.

Permite definir reglas basadas en:

* Dirección IP
* Puerto
* Protocolo

---

### **4.2 Procedimiento**

1. Buscar **Network security groups**.
2. Seleccionar **Create**.

![](./images/pr2-azure/4_Network%20Security%20Group.png)
---

### **4.3 Configuración**

* **Name:**

  ```
  nsg-backend
  ```
* **Resource group:** `rg-practica2`
* **Region:** Misma región

---

### **4.4 Configuración de Reglas de Entrada (Inbound Rules)**

Acceder a **Inbound rules → Add** y configurar las siguientes:

---

#### **Regla 1: Acceso SSH**

* **Port:** 22
* **Protocol:** TCP
* **Action:** Allow
* **Priority:** 1000
* **Name:** allow-ssh

Permite administración remota de las máquinas virtuales.

![](./images/pr2-azure/4_1.png)

---

#### **Regla 2: HTTP**

* **Port:** 80
* **Name:** allow-http

Permite tráfico web estándar.

![](./images/pr2-azure/4_2.png)

---

#### **Regla 3: Aplicación Node.js**

* **Port:** 3000
* **Name:** node-app

Permite acceso al backend Node.js.

---

#### **Regla 4: Aplicación Python**

* **Port:** 5000
* **Name:** python-app

Permite acceso al backend Python.

![](./images/pr2-azure/4_4.png)

[nota] es esta regla no fue util, ya que para que el load balancer funcione ambas VM deben estar en el mismo puerto 

---

### **4.5 Consideraciones**

* Las prioridades determinan el orden de evaluación (menor número = mayor prioridad).
* Se recomienda restringir accesos en entornos productivos.

![](./images/pr2-azure/4_5.png)

---

## **5. Creación de Máquinas Virtuales**

### **5.1 Definición**

Las **Máquinas Virtuales (VMs)** son instancias de cómputo que ejecutan sistemas operativos completos en la nube.

En este escenario se utilizan dos:

* VM para Node.js
* VM para Python

---

## **5.2 VM #1 – Node.js**

### **Configuración**

#### **Pestaña: Basics**

* **Resource group:** `rg-practica2`
* **VM name:**

  ```
  vm-node
  ```
* **Image:** Ubuntu Server 22.04 LTS
* **Size:** B1s (es posible que no deje acceder, depende de la región, usar otro tamaño)
* -> Standard_DC1 s_v3 - 1 vcpu, 8 GiB memory ($70.08)

Este tamaño es adecuado para pruebas y entornos de bajo costo.

![](./images/pr2-azure/5_2_vm_nod3.png)
![](./images/pr2-azure/5_3_node.png)

---

#### **Autenticación**

* **Username:**

  ```
  azureuser1
  ```
* **Password:** Definir una contraseña segura (se puede hacer con keys también)

---

#### **Pestaña: Networking**

* **Virtual network:** `vnet-practica2`
* **Subnet:** `subnet-backend`
* **Public IP:** Crear nueva (`ip-node`)
* **NIC NSG:** `nsg-backend`

![](./images/pr2-azure/5_vm_node.png)

#### Resumen VM node

![](./images/pr2-azure/5_5_vm_node.png)
![](./images/pr2-azure/5_6_vm_node.png)
![](./images/pr2-azure/5_7_vm_node.png)
---

## **5.3 VM #2 – Python**

Repetir la misma configuración con los siguientes cambios:

* **VM name:**

  ```
  vm-python
  ```
* **Public IP:** `ip-python`

![](./images/pr2-azure/5_8_vm_py.png)
![](./images/pr2-azure/5_9_vm_py.png)
![](./images/pr2-azure/5_10_vm_py.png)

## **5.3 VM #2 – Python deployment**
![](./images/pr2-azure/5_11_vm_py.png)

---

## **6. Conexión a las Máquinas Virtuales**

### **6.1 Acceso mediante SSH**

Desde una terminal:

```bash
ssh azureuser@IP_PUBLICA
```

o por Termius unicamente conectar la ip, usuario y clave

* node
![](./images/pr2-azure/5_4_vm_node.png)

* python
![](./images/pr2-azure/5_12_vm_py.png)

---

### **6.2 Instalación de dependencias**

#### **En VM Node**

```bash
sudo apt update
sudo apt install nodejs npm -y
```

---

#### **En VM Python**

```bash
sudo apt update
sudo apt install python3 python3-pip -y
```

---

### **6.3 Configuración de aplicaciones**

Es obligatorio que las aplicaciones escuchen en todas las interfaces de red:

#### **Node.js**

```js
app.listen(3000, "0.0.0.0");
```

#### **Python (Flask)**

```python
app.run(host="0.0.0.0", port=5000)
```

---

## **7. Load Balancer**

### **7.1 Definición**

Un **Load Balancer** distribuye el tráfico entrante entre múltiples instancias backend, mejorando:

* Disponibilidad
* Escalabilidad
* Tolerancia a fallos

---

### **7.2 Procedimiento**

1. Buscar **Load Balancer**
2. Seleccionar **Create**

---

### **7.3 Configuración**

#### **Pestaña: Basics**

* **Name:**

  ```
  lb-practica2
  ```
* **Type:** Public
* **SKU:** Standard
* **Resource group:** `rg-practica2`

![](./images/pr2-azure/6_2_lb.png)

---

### **7.4 Frontend IP**

* **Name:** frontend-ip
* **Public IP:** Crear nueva (`ip-lb`)

![](./images/pr2-azure/6_3_lb.png)

---

### **7.5 Backend Pool**

* **Name:**

  ```
  backend-pool
  ```

Agregar:

* vm-node
* vm-python

![](./images/pr2-azure/6_4_lb.png)

---

### **7.6 Health Probe**

* **Name:**

  ```
  health-probe
  ```
* **Protocol:** HTTP
* **Port:** 3000

Permite verificar si las instancias están activas.

---

### **7.7 Regla de Balanceo**

* **Name:**

  ```
  rule-http
  ```
* **Frontend port:** 80
* **Backend port:** 3000

![](./images/pr2-azure/6_5_lb.png)


---

### **7.8 Consideración Crítica**

El Load Balancer de Azure no puede enrutar tráfico a múltiples puertos distintos dentro de una misma regla.

Por lo tanto:

* Todas las aplicaciones backend deben escuchar en el mismo puerto (3000).
* Alternativamente, se requiere una arquitectura más avanzada (Application Gateway o múltiples reglas).

![](./images/pr2-azure/6_6_lb.png)

### **7.9 despliegue:**
![](./images/pr2-azure/6_7_lb.png)

### **7.10 preuba de trafico:**
![](./images/pr2-azure/6_8_lb.png)


![](./images/pr2-azure/6_9_lb.png)

---

# **8. Azure Storage Account y Blob Storage**

## **8.1 Introducción**

El servicio de **Azure Storage Account** permite almacenar datos en la nube de forma altamente disponible y escalable. Dentro de este servicio, **Blob Storage** se utiliza para:

* Almacenar archivos estáticos (frontend)
* Gestionar archivos subidos por usuarios (imágenes, documentos)
* Exponer contenido mediante URLs públicas

Este componente reemplaza servicios como Amazon S3.

---

## **8.2 Creación del Storage Account**

### **8.2.1 Definición**

Un **Storage Account** es el contenedor principal que agrupa todos los servicios de almacenamiento en Azure:

* Blob Storage (archivos)
* File Storage
* Queues
* Tables

---

### **8.2.2 Procedimiento**

1. Acceder al portal de Azure.
2. Buscar **Storage accounts**.
3. Seleccionar **Create**.

---

### **8.2.3 Configuración**

* **Resource group:**

  ```
  rg-practica2
  ```

* **Storage account name:**

  ```
  practicastorageg8
  ```

  Restricciones:

  * Solo minúsculas
  * Debe ser único globalmente

* **Region:**
  Debe coincidir con todos los recursos anteriores.

* **Performance:**

  ```
  Standard
  ```

* **Redundancy:**

  ```
  Locally-redundant storage (LRS)
  ```
![](./images/pr2-azure/8_1_SC.png)
![](./images/pr2-azure/8_2_SC.png)

---

### **8.2.4 Consideraciones y despliegue**

* LRS mantiene copias dentro del mismo datacenter, reduciendo costos.
* Es suficiente para entornos académicos o pruebas.

![](./images/pr2-azure/8_3_SC.png)

---

## **8.3 Creación de Containers**

### **8.3.1 Definición**

Un **container** es equivalente a una carpeta dentro del Blob Storage. Permite organizar archivos y definir niveles de acceso.

---

### **8.3.2 Container para Frontend**

#### **Configuración**

* **Name:**

  ```
  practica2semi1a1s2026paginawebg8
  ```

* **Public access level:**

  ```
  Blob (anonymous read access)
  ```

---

### **8.3.3 Container para Archivos**

#### **Configuración**

* **Name:**

  ```
  practica2semi1a1s2026archivosg8
  ```

* **Public access level:**

  ```
  Blob
  ```

![](./images/pr2-azure/8_4_conteiner.png)

---

### **8.3.4 Consideraciones**

* El acceso tipo `Blob` permite leer archivos mediante URL directa.
* No permite listar contenido del container, lo cual mejora la seguridad.

![](./images/pr2-azure/8_5_conteiner.png)


---

## **8.4 Hosting de Frontend Estático**

### **8.4.1 Definición**

Azure permite servir aplicaciones web estáticas directamente desde Blob Storage mediante la funcionalidad de **Static Website**.

---

### **8.4.2 Activación**

1. Ingresar al Storage Account.
2. Buscar la opción **Static website**.
3. Activar el servicio.

![](./images/pr2-azure/8_6_web.png)

---

### **8.4.3 Configuración**

* **Index document:**

  ```
  index.html
  ```

* **Error document:**

  ```
  index.html
  ```

![](./images/pr2-azure/8_7_web.png)


---

### **8.4.4 Despliegue del Frontend**

En el entorno local:

```bash
npm run build
```

Esto genera la carpeta `/dist` o `/build`.

Luego:

1. En Azure, ingresar al container `$web`.
2. Subir todos los archivos generados.

---

### **8.4.5 Resultado**

Se genera una URL pública:

```
https://practicastorageg8.z13.web.core.windows.net
```

Esta URL sirve como punto de acceso al frontend desplegado.

---

# **9. Azure Functions (Node.js)**

## **9.1 Definición**

Azure Functions es un servicio serverless que ejecuta código bajo demanda. Permite:

* Procesar solicitudes HTTP
* Ejecutar lógica sin administrar servidores
* Escalar automáticamente

En esta arquitectura, reemplaza AWS Lambda.

---

## **9.2 Flujo de funcionamiento**

1. El frontend envía archivos en base64
2. Azure Function procesa la solicitud
3. El archivo se guarda en Blob Storage
4. Se devuelve una URL pública
5. El frontend envía la URL al backend

![](./images/pr2-azure/9_1_func.png)

---

## **9.3 Implementación en Node.js**

### **9.3.1 Estructura básica**

Cada función tiene:

* `index.js` → lógica principal
* `function.json` → configuración
* `package.json` → dependencias

![](./images/pr2-azure/9_2_func.png)
![](./images/pr2-azure/9_3_func.png)

---

## **9.4 Función: upload-images**

### **Código (`index.js`)**

```javascript
const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    if (req.method === "OPTIONS") {
        context.res = {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        };
        return;
    }

    try {
        const { filename, contentType, fileData } = req.body;

        if (!filename || !fileData) {
            context.res = {
                status: 400,
                body: { error: "filename y fileData son requeridos" }
            };
            return;
        }

        const buffer = Buffer.from(fileData, "base64");

        const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
        const container = process.env.AZURE_BLOB_CONTAINER;

        const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
        const containerClient = blobServiceClient.getContainerClient(container);

        const blobName = `images/${Date.now()}_${filename}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(buffer, {
            blobHTTPHeaders: { blobContentType: contentType || "image/jpeg" }
        });

        const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
        const url = `https://${account}.blob.core.windows.net/${container}/${blobName}`;

        context.res = {
            status: 200,
            body: { url },
            headers: { "Access-Control-Allow-Origin": "*" }
        };

    } catch (error) {
        context.res = {
            status: 500,
            body: { error: error.message }
        };
    }
};
```

---

## **9.5 Función: upload-documents**

La lógica es idéntica, cambiando únicamente la ruta:

```javascript
const blobName = `documents/${Date.now()}_${filename}`;
```

---

## **9.6 Configuración de Variables de Entorno**

En la Function App → **Configuration**:

* `AZURE_STORAGE_CONNECTION_STRING`
* `AZURE_STORAGE_ACCOUNT_NAME`
* `AZURE_BLOB_CONTAINER`

---

## **9.7 Configuración de dependencias**

### **Uso del editor web**

1. Ir a **Function App**
2. Abrir **App Service Editor** o **Kudu**
3. Editar `package.json`

### **Contenido**

```json
{
  "name": "azure-functions",
  "version": "1.0.0",
  "dependencies": {
    "@azure/storage-blob": "^12.19.0"
  }
}
```

Guardar y reiniciar la Function App.

---

# **10. Azure API Management (APIM)**

## **10.1 Definición**

Azure API Management actúa como una puerta de entrada para APIs. Permite:

* Exponer endpoints limpios
* Manejar CORS
* Controlar acceso
* Centralizar servicios

Equivalente a AWS API Gateway.

---

## **10.2 Creación del Servicio**

### **Configuración**

* **Name:**

  ```
  apim-practica2-g8
  ```
* **Resource group:** `rg-practica2`
* **Pricing tier:** Consumption

![](./images/pr2-azure/10_1_api.png)
![](./images/pr2-azure/10_2_api.png)
![](./images/pr2-azure/10_3_api.png)

---

## **10.3 Integración con Azure Functions**

1. Ir a **APIs**
2. Seleccionar **Add API → Function App**
3. Seleccionar la Function App creada

---

### **Configuración**

* **Display name:**

  ```
  FileUpload API
  ```
* **Name:**

  ```
  fileupload-api
  ```
* **API URL suffix:**

  ```
  files
  ```

![](./images/pr2-azure/10_4_api.png)

---

## **10.4 Configuración de CORS**

Se debe agregar una política XML para permitir solicitudes desde el frontend:

```xml
<cors allow-credentials="false">
  <allowed-origins>
    <origin>*</origin>
  </allowed-origins>
  <allowed-methods>
    <method>GET</method>
    <method>POST</method>
    <method>OPTIONS</method>
  </allowed-methods>
  <allowed-headers>
    <header>Content-Type</header>
  </allowed-headers>
</cors>
```

---

## **10.5 URLs Finales**

Las APIs quedan expuestas como:

```
https://apim-practica2-g8.azure-api.net/files/upload-images
```

```
https://apim-practica2-g8.azure-api.net/files/upload-documents
```

---

# **11. Configuración de Variables de Entorno (.env)**

## **11.1 Frontend**

Actualizar:

```env
VITE_API_URL=https://<IP-LOAD-BALANCER>
VITE_LAMBDA_UPLOAD_IMAGES=https://apim-practica2-g8.azure-api.net/files/upload-images
VITE_LAMBDA_UPLOAD_DOCUMENTS=https://apim-practica2-g8.azure-api.net/files/upload-documents
```

---

## **11.2 Despliegue**

Después de modificar:

```bash
npm run build
```

Subir nuevamente al container `$web`.

---