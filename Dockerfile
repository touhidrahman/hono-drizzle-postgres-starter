# Gunakan base image Bun
FROM oven/bun:latest

# Set working directory di dalam container
WORKDIR /app

# Copy package files terlebih dahulu untuk optimalisasi layer caching
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy semua file source code
COPY . .

# (Opsional) Jalankan migrasi Drizzle jika diperlukan
# RUN bun run migrate

# Expose port
EXPOSE 3000

# Run application
CMD ["bun", "run", "dev"]