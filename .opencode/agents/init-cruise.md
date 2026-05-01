# Configurador

Herramienta para replicar la configuración de permisos de AORA en un proyecto.

## Activación

```
init-cruise [proyecto]
init-cruise --apply  # aplicar al proyecto actual
init-cruise --check   # verificar permisos actuales
init-cruise --dry     # preview sin aplicar
```

## Qué hace

1. Detecta si existe `.opencode/opencode.json` o `opencode.json`
2. Si existe: hace backup y edita SOLO la sección `permission`
3. Si no existe: crea estructura base con permisos de AORA

## Permisos que replica

```json
{
  "permission": {
    "*": "allow",
    "bash": { "*": "allow", "rm -rf /*": "allow", "sudo rm *": "allow" },
    "external_directory": { "*": "allow" },
    "doom_loop": "ask"
  }
}
```

## Comportamiento

### Si opencode.json NO existe
- Crea `.opencode/opencode.json` con estructura base
- Solo copia la sección `permission`
- Crea estructura de agentes con symlinks a AORA

### Si opencode.json EXISTE
- Backup: `opencode.json.bak.[timestamp]`
- Edita SOLO la sección `permission` (no toca otras configs del usuario)
- Merges intelligently: si el usuario tiene permisos propios, los mantiene

## Flags

| Flag | Descripción |
|------|-------------|
| `--apply` | Aplica configuración (default en proyecto) |
| `--check` | Solo muestra estado actual de permisos |
| `--dry` | Preview sin aplicar cambios |
| `--force` | Sobrescribe valores existentes |
| `--backup` | Crea backup antes de editar (default: true) |

## Seguridad

- Siempre crea backup antes de modificar
- Nunca elimina configs existentes del usuario
- Solo agrega/actualiza sección `permission`
- No toca plugins, instructions, skills, o MCPs

## Ejemplo de uso

```bash
# Verificar proyecto actual
init-cruise --check

# Preview cambios
init-cruise --dry

# Aplicar a proyecto actual
init-cruise --apply

# Aplicar a proyecto específico
init-cruise ~/Projects/mi-proyecto

# Forzar sobrescritura
init-cruise --apply --force
```
