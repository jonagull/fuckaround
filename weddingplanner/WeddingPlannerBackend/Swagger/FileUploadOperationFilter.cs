using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace WeddingPlannerBackend.Swagger;

public class FileUploadOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var fileParameters = context.MethodInfo.GetParameters()
            .Where(p => p.ParameterType == typeof(IFormFile) || 
                       p.ParameterType == typeof(IEnumerable<IFormFile>) ||
                       p.ParameterType == typeof(List<IFormFile>) ||
                       p.ParameterType == typeof(IFormFile[]))
            .ToList();

        if (!fileParameters.Any())
            return;

        operation.RequestBody = new OpenApiRequestBody
        {
            Content = new Dictionary<string, OpenApiMediaType>
            {
                ["multipart/form-data"] = new OpenApiMediaType
                {
                    Schema = new OpenApiSchema
                    {
                        Type = "object",
                        Properties = context.MethodInfo.GetParameters()
                            .ToDictionary(
                                p => p.Name!,
                                p => GetParameterSchema(p.ParameterType, p.Name!)
                            ),
                        Required = context.MethodInfo.GetParameters()
                            .Where(p => !p.HasDefaultValue)
                            .Select(p => p.Name!)
                            .ToHashSet()
                    }
                }
            }
        };
    }

    private OpenApiSchema GetParameterSchema(Type parameterType, string parameterName)
    {
        if (parameterType == typeof(IFormFile))
        {
            return new OpenApiSchema
            {
                Type = "string",
                Format = "binary"
            };
        }
        
        if (parameterType == typeof(IEnumerable<IFormFile>) || 
            parameterType == typeof(List<IFormFile>) || 
            parameterType == typeof(IFormFile[]))
        {
            return new OpenApiSchema
            {
                Type = "array",
                Items = new OpenApiSchema
                {
                    Type = "string",
                    Format = "binary"
                }
            };
        }

        if (parameterType == typeof(Guid))
        {
            return new OpenApiSchema
            {
                Type = "string",
                Format = "uuid"
            };
        }

        if (parameterType == typeof(string))
        {
            return new OpenApiSchema
            {
                Type = "string"
            };
        }

        if (parameterType == typeof(int))
        {
            return new OpenApiSchema
            {
                Type = "integer",
                Format = "int32"
            };
        }

        if (parameterType == typeof(bool))
        {
            return new OpenApiSchema
            {
                Type = "boolean"
            };
        }

        return new OpenApiSchema
        {
            Type = "string"
        };
    }
}